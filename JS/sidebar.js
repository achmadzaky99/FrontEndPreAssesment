document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('#sidebar ul li a');
    const content = document.getElementById('content');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            fetch(link.getAttribute('href'))
                .then(response => response.text())
                .then(html => {
                    content.innerHTML = html;
                    const scripts = content.querySelectorAll('script');
                    scripts.forEach(script => {
                        eval(script.innerText);
                    });
                });
        });
    });

    // Load default content
    sidebarLinks[0].click();
});
