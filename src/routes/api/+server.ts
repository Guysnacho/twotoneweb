import type { RequestHandler } from '@sveltejs/kit';

/**
 * @description Health check
 */
export const GET = (() => {
	return new Response(
		JSON.stringify({
			service: 'TwoTone API',
			status: 'Kickin'
		})
	);
}) satisfies RequestHandler;
