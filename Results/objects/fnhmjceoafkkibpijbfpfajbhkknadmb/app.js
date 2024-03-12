
 fetch('https://www.trickyenough.com/wp-json/chrome-extension/latest-posts/')
                .then(response => response.json())
                .then(posts => {
                    let output = '<h2 align="center">Latest Posts</h2>';
                    output += '<ul class="posts">';
                    posts.forEach(function(posts) {
                        output += `
                            <li><a href="${posts.links}" target="_blank">
                                ${posts.title}
                                </a>
                            </li>
                        `;
                    });
                    output += '</ul>'
                    document.getElementById("latestposts").innerHTML = output;
                });
