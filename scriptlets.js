function redditPopularForceUS() {
    try {
        const url = new URL(window.location.href);
        // Only redirect if on main Reddit homepage or /r/popular
        if (
            url.hostname.endsWith('reddit.com') &&
            (
                url.pathname === '/' ||
                url.pathname === '/r/popular' ||
                url.pathname === '/r/popular/'
            )
        ) {
            url.pathname = '/r/popular/best';
            url.searchParams.set('geo_filter', 'us');
            window.location.replace(url.toString());
        }
    } catch (e) {}
}

