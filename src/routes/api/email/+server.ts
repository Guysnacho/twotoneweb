import { RESEND_API_KEY, SECRET } from '$env/static/private';
import { HttpCodes } from '$lib/constants';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

type BatchEmailRequest = {
	to: string[];
	secret: string;
};

/**
 * Signup Reminder
 * @returns secret: encoded secret used to confirm requests
 */
export const POST = (async ({ request }) => {
	let input: BatchEmailRequest;

	try {
		input = await request.json();
		if (!input.to || input.to.length < 1 || input.secret !== SECRET) {
			throw error(HttpCodes.BADREQUEST, {
				code: HttpCodes.BADREQUEST,
				message: 'Invalid batch email request'
			});
		}
	} catch (err) {
		throw error(HttpCodes.BADREQUEST, {
			code: HttpCodes.BADREQUEST,
			message: 'Invalid batch email request'
		});
	}

	const { data, error: err } = await resend.emails.send({
		from: 'TwoTone <team@messages.twotone.app>',
		to: input.to,
		subject: 'TwoTone Support',
		html: BATCHEMAIL
	});

	if (err) {
		throw error(HttpCodes.INTERNALERROR, {
			code: HttpCodes.INTERNALERROR,
			message: err.message
		});
	}

	return json({
		email: data?.id
	});
}) satisfies RequestHandler;

const BATCHEMAIL = `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>TwoTone Notification</title>
      <style media="all" type="text/css">
         /* -------------------------------------
         GLOBAL RESETS
         ------------------------------------- */
         body {
         font-family: Helvetica, sans-serif;
         -webkit-font-smoothing: antialiased;
         font-size: 16px;
         line-height: 1.3;
         -ms-text-size-adjust: 100%;
         -webkit-text-size-adjust: 100%;
         }
         table {
         border-collapse: separate;
         mso-table-lspace: 0pt;
         mso-table-rspace: 0pt;
         width: 100%;
         }
         table td {
         font-family: Helvetica, sans-serif;
         font-size: 16px;
         vertical-align: top;
         }
         /* -------------------------------------
         BODY & CONTAINER
         ------------------------------------- */
         body {
         background-color: #f4f5f6;
         margin: 0;
         padding: 0;
         }
         .body {
         background-color: #f4f5f6;
         width: 100%;
         }
         .container {
         margin: 0 auto !important;
         max-width: 600px;
         padding: 0;
         padding-top: 24px;
         width: 600px;
         }
         .content {
         box-sizing: border-box;
         display: block;
         margin: 0 auto;
         max-width: 600px;
         padding: 0;
         }
         /* -------------------------------------
         HEADER, FOOTER, MAIN
         ------------------------------------- */
         .main {
         background: #ffffff;
         border: 1px solid #eaebed;
         border-radius: 16px;
         width: 100%;
         }
         .wrapper {
         box-sizing: border-box;
         padding: 24px;
         }
         .footer {
         clear: both;
         padding-top: 24px;
         text-align: center;
         width: 100%;
         }
         .footer td,
         .footer p,
         .footer span,
         .footer a {
         color: #9a9ea6;
         font-size: 16px;
         text-align: center;
         }
         .social-nav-icon:hover svg {
         fill: #9fe388
         }
         @media (min-width: 900px) {
         .site-footer ul.footer-copyright-links {
         justify-content:space-around
         }
         }
         .site-footer-social {
         display: flex;
         flex-flow: column wrap;
         justify-content: center;
         margin: auto;
         order: 2;
         width: 100%;
		 padding-inline: auto
         }
         .site-footer-social .social-nav-icon {
         display: block;
         height: 2rem;
         margin: auto;
         width: 2rem
         }
         @media (min-width: 900px) {
         .site-footer-social {
         flex-flow:column nowrap;
         justify-content: space-around;
         order: 2;
         margin: auto;
         width: auto
         }
         .site-footer-social .social-nav-icon {
         height: 3vw;
         margin: auto;
         width: 3vw
         }
         }
         @media (min-width: 900px) {
         .site-footer-social .social-nav-icon {
         display: block;
         height: 2rem;
         margin: auto;
         width: 2rem;
         }
		}
         /* -------------------------------------
         TYPOGRAPHY
         ------------------------------------- */
         p {
         font-family: Helvetica, sans-serif;
         font-size: 16px;
         font-weight: normal;
         margin: 0;
         margin-bottom: 16px;
         }
         a {
         color: #283a22;
         text-decoration: underline;
         }
         /* -------------------------------------
         BUTTONS
         ------------------------------------- */
         .btn {
         box-sizing: border-box;
         min-width: 100% !important;
         width: 100%;
         }
         .btn > tbody > tr > td {
         padding-bottom: 16px;
         }
         .btn table {
         width: auto;
         }
         .btn table td {
         background-color: #ffffff;
         border-radius: 4px;
         text-align: center;
         }
         .btn a {
         background-color: #ffffff;
         border: solid 2px #283a22;
         border-radius: 4px;
         box-sizing: border-box;
         color: #283a22;
         cursor: pointer;
         display: inline-block;
         font-size: 16px;
         font-weight: bold;
         margin: 0;
         padding: 12px 24px;
         text-decoration: none;
         text-transform: capitalize;
         }
         .btn-primary table td {
         background-color: #283a22;
         }
         .btn-primary a {
         background-color: #283a22;
         border-color: #283a22;
         color: #ffffff;
         }
         @media all {
         .btn-primary table td:hover {
         background-color: #ec0867 !important;
         }
         .btn-primary a:hover {
         background-color: #ec0867 !important;
         border-color: #ec0867 !important;
         }
         }
         /* -------------------------------------
         OTHER STYLES THAT MIGHT BE USEFUL
         ------------------------------------- */
         .last {
         margin-bottom: 0;
         }
         .first {
         margin-top: 0;
         }
         .align-center {
         text-align: center;
         }
         .align-right {
         text-align: right;
         }
         .align-left {
         text-align: left;
         }
         .text-link {
         color: #283a22 !important;
         text-decoration: underline !important;
         }
         .clear {
         clear: both;
         }
         .mt0 {
         margin-top: 0;
         }
         .mb0 {
         margin-bottom: 0;
         }
         .preheader {
         color: transparent;
         display: none;
         height: 0;
         max-height: 0;
         max-width: 0;
         opacity: 0;
         overflow: hidden;
         mso-hide: all;
         visibility: hidden;
         width: 0;
         }
         .powered-by a {
         text-decoration: none;
         }
         /* -------------------------------------
         RESPONSIVE AND MOBILE FRIENDLY STYLES
         ------------------------------------- */
         @media only screen and (max-width: 640px) {
         .main p,
         .main td,
         .main span {
         font-size: 16px !important;
         }
         .wrapper {
         padding: 8px !important;
         }
         .content {
         padding: 0 !important;
         }
         .container {
         padding: 0 !important;
         padding-top: 8px !important;
         width: 100% !important;
         }
         .main {
         border-left-width: 0 !important;
         border-radius: 0 !important;
         border-right-width: 0 !important;
         }
         .btn table {
         max-width: 100% !important;
         width: 100% !important;
         }
         .btn a {
         font-size: 16px !important;
         max-width: 100% !important;
         width: 100% !important;
         }
         }
         /* -------------------------------------
         PRESERVE THESE STYLES IN THE HEAD
         ------------------------------------- */
         @media all {
         .ExternalClass {
         width: 100%;
         }
         .ExternalClass,
         .ExternalClass p,
         .ExternalClass span,
         .ExternalClass font,
         .ExternalClass td,
         .ExternalClass div {
         line-height: 100%;
         }
         .apple-link a {
         color: inherit !important;
         font-family: inherit !important;
         font-size: inherit !important;
         font-weight: inherit !important;
         line-height: inherit !important;
         text-decoration: none !important;
         }
         #MessageViewBody a {
         color: inherit;
         text-decoration: none;
         font-size: inherit;
         font-family: inherit;
         font-weight: inherit;
         line-height: inherit;
         }
         }
      </style>
   </head>
   <body>
      <table
         role="presentation"
         border="0"
         cellpadding="0"
         cellspacing="0"
         class="body"
         >
         <tr>
            <td>&nbsp;</td>
            <td class="container">
               <div class="content">
                  <!-- START CENTERED WHITE CONTAINER -->
                  <span class="preheader"
                     >TwoTone SignUp Issues</span
                     >
                  <table
                     role="presentation"
                     border="0"
                     cellpadding="0"
                     cellspacing="0"
                     class="main"
                     >
                     <!-- START MAIN CONTENT AREA -->
                     <tr>
                        <td class="wrapper">
                           <table
                              role="presentation"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="btn"
                              >
                              <tbody>
                                 <tr>
                                    <td align="center">
                                       <table
                                          role="presentation"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          >
                                          <tbody>
                                             <tr>
                                                <td>
                                                   <a href="https://twotone.app" target="_blank"
                                                      ><img
                                                      src="https://ojetquufzwfvbqakaque.supabase.co/storage/v1/object/public/static/twotone_logo.png"
                                                      alt="TwoTone Logo"
                                                      style="margin-inline: auto"
                                                      height="100px"
                                                      width="100px"
                                                      /></a
                                                      >
                                                </td>
                                             </tr>
                                          </tbody>
                                       </table>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                           <p>Hey Community</p>
                           <p>
                              I've had an ongoing quality issue with sending confirmation emails to people after signup. If you've been able to login, you can ignore this but I hope you're chilling and having a nice day. Maaaayyybe share what you're listening to :) <br/ ><br/ >
                              If you haven't and do still wanna test out the app or share your Songs of the Day, you should be good to go after attempting a sign up one more time. If it doesn't work, send the app to the depths of your garbage can. I'll understand.
                           </p>
                           <p>
                              Thanks for the time!
                           </p>
                           <p>
                              P.S. - To everyone that's stuck around, the recs have been awesome! Keep em coming 🫀
                           </p>
                           <p>- Sam, TwoTone CEO (? Don't really have those yet but whatever)</p>
                        </td>
                     </tr>
                     <!-- END MAIN CONTENT AREA -->
                  </table>
                  <!-- START FOOTER -->
                  <div class="footer">
                     <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        >
                        <tr>
                           <td class="content-block">
                              <span class="apple-link"
                                 >Tunji Productions LLC.</span
                                 >
                              <br />
                              Don't like these emails? Don't worry, its a 1 and only 1 time thing :)
                              <!-- <a href="http://htmlemail.io/blog">Unsubscribe</a>. -->
                           </td>
                        </tr>
                        <tr>
                           <td class="content-block powered-by">
                              Powered by <a href="https://GitHub.com/Guysnacho" style="text-decoration-line: underline;">Me</a>
                           </td>
                        </tr>
                        <tr>
                           <td class="content-block">
                              <div data-nosnippet="" class="site-footer-social">
                                 <a class="social-nav-icon" href="https://www.instagram.com/twotone.mobile/" target="_blank" rel="noreferrer nofollow">
                                    <span class="icon-name" style="display: none;">Instagram</span>
                                    <svg width="100%" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <circle cx="71" cy="71" r="70.5" stroke="#482317"></circle>
                                       <path d="M71.5 34.0135C83.3899 34.0135 84.7979 34.0656 89.4738 34.2742C93.8195 34.4654 96.1662 35.1955 97.7307 35.8039C99.7992 36.6035 101.294 37.577 102.841 39.124C104.406 40.6885 105.362 42.166 106.161 44.2346C106.77 45.799 107.5 48.1631 107.691 52.4914C107.9 57.1848 107.952 58.5928 107.952 70.4652C107.952 82.3551 107.9 83.7631 107.691 88.4391C107.5 92.7848 106.77 95.1314 106.161 96.6959C105.362 98.7645 104.388 100.259 102.841 101.806C101.277 103.371 99.7992 104.327 97.7307 105.127C96.1662 105.735 93.8022 106.465 89.4738 106.656C84.7805 106.865 83.3725 106.917 71.5 106.917C59.6102 106.917 58.2022 106.865 53.5262 106.656C49.1805 106.465 46.8338 105.735 45.2693 105.127C43.2008 104.327 41.7059 103.354 40.1588 101.806C38.5943 100.242 37.6383 98.7645 36.8387 96.6959C36.2303 95.1314 35.5002 92.7674 35.309 88.4391C35.1004 83.7457 35.0482 82.3377 35.0482 70.4652C35.0482 58.5754 35.1004 57.1674 35.309 52.4914C35.5002 48.1457 36.2303 45.799 36.8387 44.2346C37.6383 42.166 38.6117 40.6711 40.1588 39.124C41.7232 37.5596 43.2008 36.6035 45.2693 35.8039C46.8338 35.1955 49.1979 34.4654 53.5262 34.2742C58.2022 34.0656 59.6102 34.0135 71.5 34.0135ZM71.5 26C59.4189 26 57.9066 26.0521 53.1611 26.2607C48.433 26.4693 45.1824 27.2342 42.3664 28.3293C39.4287 29.4766 36.943 30.9889 34.4746 33.4746C31.9889 35.943 30.4766 38.4287 29.3293 41.349C28.2342 44.1824 27.4693 47.4156 27.2607 52.1437C27.0521 56.9066 27 58.4189 27 70.5C27 82.5811 27.0521 84.0934 27.2607 88.8389C27.4693 93.567 28.2342 96.8176 29.3293 99.6336C30.4766 102.571 31.9889 105.057 34.4746 107.525C36.943 109.994 39.4287 111.523 42.349 112.653C45.1824 113.748 48.4156 114.513 53.1438 114.722C57.8893 114.93 59.4016 114.983 71.4826 114.983C83.5637 114.983 85.076 114.93 89.8215 114.722C94.5496 114.513 97.8002 113.748 100.616 112.653C103.537 111.523 106.022 109.994 108.491 107.525C110.959 105.057 112.489 102.571 113.619 99.651C114.714 96.8176 115.479 93.5844 115.687 88.8563C115.896 84.1107 115.948 82.5984 115.948 70.5174C115.948 58.4363 115.896 56.924 115.687 52.1785C115.479 47.4504 114.714 44.1998 113.619 41.3838C112.523 38.4287 111.011 35.943 108.525 33.4746C106.057 31.0062 103.571 29.4766 100.651 28.3467C97.8176 27.2516 94.5844 26.4867 89.8563 26.2781C85.0934 26.0521 83.5811 26 71.5 26Z" fill="#482317"></path>
                                       <path d="M71.5 47.6416C58.8801 47.6416 48.6416 57.8801 48.6416 70.5C48.6416 83.1199 58.8801 93.3584 71.5 93.3584C84.1199 93.3584 94.3584 83.1199 94.3584 70.5C94.3584 57.8801 84.1199 47.6416 71.5 47.6416ZM71.5 85.3275C63.3127 85.3275 56.6725 78.6873 56.6725 70.5C56.6725 62.3127 63.3127 55.6725 71.5 55.6725C79.6873 55.6725 86.3275 62.3127 86.3275 70.5C86.3275 78.6873 79.6873 85.3275 71.5 85.3275Z" fill="#482317"></path>
                                       <path d="M100.599 46.7369C100.599 49.692 98.2 52.0735 95.2623 52.0735C92.3072 52.0735 89.9258 49.6746 89.9258 46.7369C89.9258 43.7818 92.3246 41.4004 95.2623 41.4004C98.2 41.4004 100.599 43.7992 100.599 46.7369Z" fill="#482317"></path>
                                    </svg>
                                 </a>
                              </div>
                           </td>
                        </tr>
                     </table>
                  </div>
                  <!-- END FOOTER -->
                  <!-- END CENTERED WHITE CONTAINER -->
               </div>
            </td>
            <td>&nbsp;</td>
         </tr>
      </table>
   </body>
</html>`;
