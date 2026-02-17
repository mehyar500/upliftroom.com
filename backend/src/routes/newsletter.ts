import type { Env } from '../types'
import { jsonResponse } from '../utils/response'
import { getSupabaseClient } from '../utils/supabase'

interface NewsletterSignupRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  zip: string
}

export async function signupNewsletter(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as NewsletterSignupRequest

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName || !body.phone || !body.zip) {
      return jsonResponse(
        { 
          status: 'error', 
          message: 'Missing required fields: email, firstName, lastName, phone, and zip are required' 
        },
        400
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return jsonResponse(
        { status: 'error', message: 'Invalid email format' },
        400
      )
    }

    // Save to Supabase database first (always do this)
    const supabase = getSupabaseClient(env)
    
    // Check if email already exists
    const { data: existingSignup } = await supabase
      .from('newsletter_signups')
      .select('id, email, brevo_synced_at')
      .eq('email', body.email)
      .single()

    // Upsert the record (insert or update)
    const { error: dbError } = await supabase
      .from('newsletter_signups')
      .upsert({
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        phone: body.phone,
        zip: body.zip,
        source: 'website',
        // Reset Brevo sync fields to allow retry
        brevo_list_id: null,
        brevo_synced_at: null,
      }, {
        onConflict: 'email',
      })

    if (dbError) {
      console.error('Failed to save to database:', dbError)
      return jsonResponse(
        { status: 'error', message: 'Failed to save signup', detail: dbError.message },
        500
      )
    }

    const isRetry = existingSignup !== null
    if (isRetry) {
      console.log('Re-signup detected for:', body.email, '- Retrying Brevo sync')
    }

    // Try to sync with Brevo (optional - don't fail if this doesn't work)
    let brevoSynced = false
    let brevoListId: number | null = null

    try {
      const brevoApiKey = (env as any).BREVO_API_KEY
      
      if (brevoApiKey) {
        console.log('Attempting Brevo sync...')
        
        // Use the known list ID directly (ID: 2 from the URL)
        const targetListId = 2
        
        // Verify the list exists by fetching it directly
        const listCheckResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/${targetListId}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'api-key': brevoApiKey,
          },
        })

        if (listCheckResponse.ok) {
          const listData = await listCheckResponse.json() as { id: number; name: string }
          console.log('Found target list:', listData.name, '(ID:', targetListId, ')')
          
          // Create or update contact in Brevo
          const contactData = {
            email: body.email,
            attributes: {
              FIRSTNAME: body.firstName,
              LASTNAME: body.lastName,
              SMS: body.phone,
              ZIPCODE: body.zip,
            },
            listIds: [targetListId],
            updateEnabled: true,
          }

          const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': brevoApiKey,
            },
            body: JSON.stringify(contactData),
          })

          console.log('Brevo contact response status:', brevoResponse.status)

          if (brevoResponse.status === 201 || brevoResponse.status === 204) {
            brevoSynced = true
            brevoListId = targetListId

            console.log('Brevo sync successful, updating database...')

            // Update the database record with Brevo sync info
            await supabase
              .from('newsletter_signups')
              .update({
                brevo_list_id: targetListId,
                brevo_synced_at: new Date().toISOString(),
              })
              .eq('email', body.email)
            
            console.log('Database updated with Brevo sync info')
          } else {
            const responseText = await brevoResponse.text()
            console.warn('Brevo sync failed:', brevoResponse.status, responseText)
          }
        } else {
          const errorText = await listCheckResponse.text()
          console.warn('Failed to fetch Brevo list ID 2:', errorText)
        }
      } else {
        console.warn('BREVO_API_KEY not configured')
      }
    } catch (brevoError) {
      console.warn('Brevo sync error (non-fatal):', brevoError)
    }

    // Return success regardless of Brevo sync status
    return jsonResponse({
      status: 'ok',
      message: isRetry 
        ? 'Information updated and Brevo sync retried' 
        : 'Successfully subscribed to newsletter',
      data: {
        email: body.email,
        savedToDatabase: true,
        brevoSynced,
        isRetry,
        ...(brevoListId && { brevoListId }),
      },
    })
  } catch (error) {
    console.error('Newsletter signup error:', error)
    return jsonResponse(
      {
        status: 'error',
        message: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}
