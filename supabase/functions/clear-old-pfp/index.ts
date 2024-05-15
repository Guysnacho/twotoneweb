// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization'
};

Deno.serve(async (req) => {
	console.log('Cleaning old profile pic');

	try {
		if (
			req.method !== 'POST' &&
			!req.headers.get('user_agent')!.includes(Deno.env.get('EDGE_SECRET')!)
		) {
			return new Response(JSON.stringify({ message: 'Whatcha doin?' }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 401
			});
		}
		// Create a Supabase client with the Auth context of the logged in user.
		const supabaseClient = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			Deno.env.get('SUPABASE_ANON_KEY') ?? ''
			// Create client with Auth context of the user that called the function.
			// This way your row-level-security (RLS) policies are applied.
			// {
			// 	global: {
			// 		headers: { Authorization: `Bearer ${authheader!}` }
			// 	}
			// }
		);

		// Get update payload
		const textBody = await req.text();
		// Create body
		const user_id = textBody.substring(textBody.indexOf('=') + 1);
		// Validate
		if (
			user_id === undefined ||
			user_id.length !== 36 ||
			user_id.charAt(8) !== '-' ||
			user_id.charAt(13) !== '-' ||
			user_id.charAt(18) !== '-' ||
			user_id.charAt(23) !== '-'
		) {
			console.error('Bad request, recieved somethin shady - %s', user_id);
			return new Response(
				JSON.stringify({ message: 'Bad request somehow... again, whatcha doin? :)' }),
				{
					headers: { ...corsHeaders, 'Content-Type': 'application/json' },
					status: 401
				}
			);
		}
		console.debug('User ID - %s', user_id);

		// Get list of files present
		console.log('Fetching objects');
		const { data, error } = await supabaseClient.storage
			.from('avatars')
			.list(user_id, { sortBy: { column: 'updated_at', order: 'desc' } });

		if (error) throw error;

		if (data) {
			console.log('Deleting objects');
			const { data: results, error: err } = await supabaseClient.storage
				.from('avatars')
				.remove(data?.slice(1).map((file) => user_id + '/' + file.name));
			if (err) throw err;

			results?.forEach((obj) =>
				console.log(`Successfully Deleted - ${obj.name} for user ${obj.owner}`)
			);
		} else {
			console.log('Nothing to clear');
		}

		return new Response(JSON.stringify({ message: 'Mission accomplished' }), {
			headers: { ...corsHeaders },
			status: 201
		});
	} catch (error) {
		console.error(error);

		if (error.message.includes('Unexpected end of JSON input')) {
			return new Response(JSON.stringify({ message: 'Weird request there bucko' }), {
				headers: { ...corsHeaders },
				status: 400
			});
		} else {
			return new Response(JSON.stringify({ error: error.message }), {
				headers: { ...corsHeaders, 'Content-Type': 'application/json' },
				status: 400
			});
		}
	}
});
