// Limit public data exposure. Add as a Code Snippets snippet (scope: global, "Run everywhere").
// Disable the snippet to roll back. Before enabling, check nothing public uses /wp-json/wp/v2
// (a headless front end, a mobile app, a JS widget that lists posts) or XML-RPC (Jetpack, the WP mobile app).

// 1. Disable XML-RPC (password-guessing amplifier: hundreds of guesses per request).
add_filter( 'xmlrpc_enabled', '__return_false' );

// 2. Hide the core REST API (/wp-json/wp/v2/*: users, posts, media...) from logged-out visitors.
//    Logged-in editors, Elementor and the block editor are unaffected. Plugin namespaces
//    (contact forms, SEO, MCP) are untouched because only /wp/v2 is blocked.
add_filter( 'rest_pre_dispatch', function ( $result, $server, $request ) {
	if ( null !== $result || is_user_logged_in() ) {
		return $result;
	}
	if ( 0 === strpos( $request->get_route(), '/wp/v2' ) ) {
		return new WP_Error( 'rest_forbidden', 'Not available.', array( 'status' => 401 ) );
	}
	return $result;
}, 10, 3 );

// 3. Stop ?author=N username enumeration for logged-out visitors.
add_action( 'template_redirect', function () {
	if ( is_author() && ! is_user_logged_in() ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
} );

// Verify (logged out): /wp-json/wp/v2/users -> 401, /?author=1 -> 301 to home, /xmlrpc.php POST -> "XML-RPC services are disabled".
