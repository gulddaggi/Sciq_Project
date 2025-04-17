window.onload = function () {
    window.ui = SwaggerUIBundle({
        url: "/api/v3/api-docs",  // 여기서 원하는 경로로 지정
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
    });
};
