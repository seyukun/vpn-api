import { createSwaggerSpec } from "next-swagger-doc";

export default async function GetApiDocsV01Beta() {
  const spec = createSwaggerSpec({
    apiFolder: "pages/api/v0.1-beta", // define api folder under app folder
    definition: {
      openapi: "3.0.3",
      info: {
        title: "WG-VPM API",
        description:
          "This API registers and provides user connection infomation.",
        termsOfService: "http://swagger.io/terms/",
        contact: {
          email: "yushin-sato@kalytero.ne.jp",
        },
        license: {
          name: "BSD-4",
          url: "https://github.com/kalytero/LICENSE-BSD4",
        },
        version: "0.0.1",
      },
      servers: [
        {
          url: "https://localhost/api/v0.1-beta",
        },
      ],
      tags: [
        {
          name: "user",
          description: "user",
        },
      ],
      paths: {
        "/user": {
          get: {
            summary: "Get current user info",
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        username: {
                          type: "string",
                          description: "username",
                          pattern: "^[a-zA-Z0-9_]*$",
                          maxLength: 64,
                        },
                        bearer: {
                          type: "string",
                          description: "breaer token",
                          pattern: "^[a-zA-Z0-9_]*$",
                          maxLength: 64,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          put: {
            summary: "Update current user info",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      username: {
                        type: "string",
                        description: "username",
                        pattern: "^[a-zA-Z0-9_]*$",
                        maxLength: 64,
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        user: {
                          type: "string",
                          description: "user",
                          pattern: "^[a-zA-Z0-9_]*$",
                          maxLength: 64,
                        },
                        bearer: {
                          type: "string",
                          description: "breaer token",
                          pattern: "^[a-zA-Z0-9_]*$",
                          maxLength: 64,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/user/config": {
          get: {
            summary: "Get current user config",
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        public_key: {
                          type: "string",
                          description: "public key",
                          pattern: "^[a-z0-9]{0,64}$",
                          maxLength: 64,
                        },
                        endpoint: {
                          type: "string",
                          description: "endpoint",
                          pattern:
                            "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}:[0-9]{1,5}$",
                          maxLength: 21,
                        },
                        peers: {
                          type: "array",
                          description: "peers",
                          items: {
                            type: "object",
                            properties: {
                              public_key: {
                                type: "string",
                                description: "peer public key",
                                pattern: "^[a-z0-9]*$",
                                maxLength: 64,
                              },
                              endpoint: {
                                type: "string",
                                description: "peer endpoint",
                                pattern:
                                  "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}:[0-9]{1,5}$",
                                maxLength: 21,
                              },
                              allowed_ips: {
                                type: "array",
                                description: "allowed ips",
                                items: {
                                  type: "string",
                                  description: "allowed ip",
                                  pattern:
                                    "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}/[0-9]{1,2}$",
                                  maxLength: 18,
                                },
                              },
                              persistent_keepalive: {
                                type: "integer",
                                description: "persistent keepalive",
                                minimum: 5,
                                maximum: 25,
                                format: "int32",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          post: {
            summary: "Register current user config",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      public_key: {
                        type: "string",
                        description: "public key",
                        pattern: "^[a-z0-9]{64}$",
                        maxLength: 64,
                      },
                      endpoint: {
                        type: "string",
                        description: "endpoint",
                        pattern:
                          "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}:[0-9]{1,5}$",
                        maxLength: 21,
                      },
                      peers: {
                        type: "array",
                        description: "peers",
                        items: {
                          type: "object",
                          properties: {
                            public_key: {
                              type: "string",
                              description: "peer public key",
                              pattern: "^[a-z0-9]*$",
                              maxLength: 64,
                            },
                            endpoint: {
                              type: "string",
                              description: "peer endpoint",
                              pattern:
                                "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}:[0-9]{1,5}$",
                              maxLength: 21,
                            },
                            allowed_ips: {
                              type: "array",
                              description: "allowed ips",
                              items: {
                                type: "string",
                                description: "allowed ip",
                                pattern:
                                  "^[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}/[0-9]{1,2}$",
                                maxLength: 18,
                              },
                            },
                            persistent_keepalive: {
                              type: "integer",
                              description: "persistent keepalive",
                              minimum: 5,
                              maximum: 25,
                              format: "int32",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        public_key: {
                          type: "string",
                          description: "public key",
                          pattern: "^[a-z0-9]*$",
                          maxLength: 64,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });
  return spec;
}
