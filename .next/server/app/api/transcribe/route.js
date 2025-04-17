/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/transcribe/route";
exports.ids = ["app/api/transcribe/route"];
exports.modules = {

/***/ "(rsc)/./app/api/transcribe/route.ts":
/*!*************************************!*\
  !*** ./app/api/transcribe/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   config: () => (/* binding */ config)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _server_openai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../server/openai */ \"(rsc)/./server/openai.ts\");\n\n\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        if (!body || !body.audio) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Missing audio data\"\n            }, {\n                status: 400\n            });\n        }\n        // Convert base64 to buffer\n        const audioBase64 = body.audio.replace(/^data:audio\\/\\w+;base64,/, \"\");\n        const audioBuffer = Buffer.from(audioBase64, \"base64\");\n        // Transcribe the audio\n        const transcript = await (0,_server_openai__WEBPACK_IMPORTED_MODULE_1__.transcribeAudio)(audioBuffer);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            transcript\n        });\n    } catch (error) {\n        console.error(\"Error transcribing audio:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Failed to transcribe audio\"\n        }, {\n            status: 500\n        });\n    }\n}\n// Increase the body size limit for audio uploads\nconst config = {\n    api: {\n        bodyParser: {\n            sizeLimit: \"10mb\"\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3RyYW5zY3JpYmUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUE2RDtBQUNKO0FBRWxELGVBQWVFLEtBQUtDLE9BQW9CO0lBQzdDLElBQUk7UUFDRixNQUFNQyxPQUFPLE1BQU1ELFFBQVFFLElBQUk7UUFFL0IsSUFBSSxDQUFDRCxRQUFRLENBQUNBLEtBQUtFLEtBQUssRUFBRTtZQUN4QixPQUFPTixxREFBWUEsQ0FBQ0ssSUFBSSxDQUN0QjtnQkFBRUUsU0FBUztZQUFxQixHQUNoQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsMkJBQTJCO1FBQzNCLE1BQU1DLGNBQWNMLEtBQUtFLEtBQUssQ0FBQ0ksT0FBTyxDQUFDLDRCQUE0QjtRQUNuRSxNQUFNQyxjQUFjQyxPQUFPQyxJQUFJLENBQUNKLGFBQWE7UUFFN0MsdUJBQXVCO1FBQ3ZCLE1BQU1LLGFBQWEsTUFBTWIsK0RBQWVBLENBQUNVO1FBRXpDLE9BQU9YLHFEQUFZQSxDQUFDSyxJQUFJLENBQUM7WUFBRVM7UUFBVztJQUN4QyxFQUFFLE9BQU9DLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDZCQUE2QkE7UUFDM0MsT0FBT2YscURBQVlBLENBQUNLLElBQUksQ0FDdEI7WUFBRUUsU0FBUztRQUE2QixHQUN4QztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRjtBQUVBLGlEQUFpRDtBQUMxQyxNQUFNUyxTQUFTO0lBQ3BCQyxLQUFLO1FBQ0hDLFlBQVk7WUFDVkMsV0FBVztRQUNiO0lBQ0Y7QUFDRixFQUFFIiwic291cmNlcyI6WyIvVXNlcnMvdmFuY2VtY2dyYWR5L0RvY3VtZW50cy9yZXBvcy9Qb2RjYXN0QUkvYXBwL2FwaS90cmFuc2NyaWJlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgdHJhbnNjcmliZUF1ZGlvIH0gZnJvbSBcIi4uLy4uLy4uL3NlcnZlci9vcGVuYWlcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG5cbiAgICBpZiAoIWJvZHkgfHwgIWJvZHkuYXVkaW8pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBtZXNzYWdlOiBcIk1pc3NpbmcgYXVkaW8gZGF0YVwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGJhc2U2NCB0byBidWZmZXJcbiAgICBjb25zdCBhdWRpb0Jhc2U2NCA9IGJvZHkuYXVkaW8ucmVwbGFjZSgvXmRhdGE6YXVkaW9cXC9cXHcrO2Jhc2U2NCwvLCBcIlwiKTtcbiAgICBjb25zdCBhdWRpb0J1ZmZlciA9IEJ1ZmZlci5mcm9tKGF1ZGlvQmFzZTY0LCBcImJhc2U2NFwiKTtcblxuICAgIC8vIFRyYW5zY3JpYmUgdGhlIGF1ZGlvXG4gICAgY29uc3QgdHJhbnNjcmlwdCA9IGF3YWl0IHRyYW5zY3JpYmVBdWRpbyhhdWRpb0J1ZmZlcik7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB0cmFuc2NyaXB0IH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB0cmFuc2NyaWJpbmcgYXVkaW86XCIsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICB7IG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHRyYW5zY3JpYmUgYXVkaW9cIiB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKTtcbiAgfVxufVxuXG4vLyBJbmNyZWFzZSB0aGUgYm9keSBzaXplIGxpbWl0IGZvciBhdWRpbyB1cGxvYWRzXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBhcGk6IHtcbiAgICBib2R5UGFyc2VyOiB7XG4gICAgICBzaXplTGltaXQ6IFwiMTBtYlwiLFxuICAgIH0sXG4gIH0sXG59O1xuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInRyYW5zY3JpYmVBdWRpbyIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsImpzb24iLCJhdWRpbyIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJhdWRpb0Jhc2U2NCIsInJlcGxhY2UiLCJhdWRpb0J1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJ0cmFuc2NyaXB0IiwiZXJyb3IiLCJjb25zb2xlIiwiY29uZmlnIiwiYXBpIiwiYm9keVBhcnNlciIsInNpemVMaW1pdCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/transcribe/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftranscribe%2Froute&page=%2Fapi%2Ftranscribe%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftranscribe%2Froute.ts&appDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftranscribe%2Froute&page=%2Fapi%2Ftranscribe%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftranscribe%2Froute.ts&appDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_vancemcgrady_Documents_repos_PodcastAI_app_api_transcribe_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/transcribe/route.ts */ \"(rsc)/./app/api/transcribe/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/transcribe/route\",\n        pathname: \"/api/transcribe\",\n        filename: \"route\",\n        bundlePath: \"app/api/transcribe/route\"\n    },\n    resolvedPagePath: \"/Users/vancemcgrady/Documents/repos/PodcastAI/app/api/transcribe/route.ts\",\n    nextConfigOutput,\n    userland: _Users_vancemcgrady_Documents_repos_PodcastAI_app_api_transcribe_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0cmFuc2NyaWJlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ0cmFuc2NyaWJlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdHJhbnNjcmliZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnZhbmNlbWNncmFkeSUyRkRvY3VtZW50cyUyRnJlcG9zJTJGUG9kY2FzdEFJJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRnZhbmNlbWNncmFkeSUyRkRvY3VtZW50cyUyRnJlcG9zJTJGUG9kY2FzdEFJJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5QjtBQUN0RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL3ZhbmNlbWNncmFkeS9Eb2N1bWVudHMvcmVwb3MvUG9kY2FzdEFJL2FwcC9hcGkvdHJhbnNjcmliZS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdHJhbnNjcmliZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3RyYW5zY3JpYmVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3RyYW5zY3JpYmUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvdmFuY2VtY2dyYWR5L0RvY3VtZW50cy9yZXBvcy9Qb2RjYXN0QUkvYXBwL2FwaS90cmFuc2NyaWJlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftranscribe%2Froute&page=%2Fapi%2Ftranscribe%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftranscribe%2Froute.ts&appDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./server/openai.ts":
/*!**************************!*\
  !*** ./server/openai.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateLearncastContent: () => (/* binding */ generateLearncastContent),\n/* harmony export */   textToSpeech: () => (/* binding */ textToSpeech),\n/* harmony export */   transcribeAudio: () => (/* binding */ transcribeAudio)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"(rsc)/./node_modules/openai/index.mjs\");\n\n// the newest OpenAI model is \"gpt-4o\" which was released May 13, 2024. do not change this unless explicitly requested by the user\nconst openai = new openai__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n    apiKey: process.env.OPENAI_API_KEY || \"sk-dummy\"\n});\n// Transcribe audio to text\nasync function transcribeAudio(audioBuffer) {\n    try {\n        const tempFilePath = `/tmp/recording-${Date.now()}.webm`;\n        const fs = await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! fs */ \"fs\", 23));\n        fs.writeFileSync(tempFilePath, audioBuffer);\n        const audioReadStream = fs.createReadStream(tempFilePath);\n        const transcription = await openai.audio.transcriptions.create({\n            file: audioReadStream,\n            model: \"whisper-1\"\n        });\n        // Clean up temp file\n        fs.unlinkSync(tempFilePath);\n        return transcription.text;\n    } catch (error) {\n        console.error(\"Error transcribing audio:\", error);\n        const errorMessage = error instanceof Error ? error.message : \"Unknown error\";\n        throw new Error(`Failed to transcribe audio: ${errorMessage}`);\n    }\n}\n// Generate learncast content based on topic\nasync function generateLearncastContent(topic) {\n    try {\n        const response = await openai.chat.completions.create({\n            model: \"gpt-4o\",\n            messages: [\n                {\n                    role: \"system\",\n                    content: \"You are an expert creator of Learncasts - high-quality educational audio content that combines the knowledge depth of a lecture with the engaging narrative style of premium educational content. \" + \"Focus on creating content that's eloquent, immersive, and educational with a warm, authoritative teaching voice. \" + \"Write in a literary style suitable for educational audio - clear, descriptive, and engaging with a professional narrator's voice. \" + \"Avoid podcast-specific elements like host introductions, interjections, or references to 'listeners' or 'episodes'. \" + \"The narrative should flow smoothly with proper transitions between sections. \" + \"The length should be appropriate for about a 30-minute learncast (approximately 4500-5000 words).\"\n                },\n                {\n                    role: \"user\",\n                    content: `Create a Learncast about \"${topic}\". Provide a JSON response with the following structure: \n          {\n            \"title\": \"An informative and engaging title for the Learncast\",\n            \"description\": \"A brief 1-2 sentence description of what this Learncast covers\",\n            \"content\": \"The full Learncast content\"\n          }`\n                }\n            ],\n            response_format: {\n                type: \"json_object\"\n            }\n        });\n        const result = JSON.parse(response.choices[0].message.content || \"{}\");\n        return {\n            title: result.title || `Learncast about ${topic}`,\n            description: result.description || `A learncast exploring ${topic}`,\n            content: result.content || `Failed to generate learncast content for ${topic}`\n        };\n    } catch (error) {\n        console.error(\"Error generating learncast content:\", error);\n        const errorMessage = error instanceof Error ? error.message : \"Unknown error\";\n        throw new Error(`Failed to generate learncast content: ${errorMessage}`);\n    }\n}\n// Convert text to speech using OpenAI TTS\nasync function textToSpeech(text) {\n    try {\n        // TTS-1 has a character limit of 4096, so we need to split long text\n        const MAX_CHUNK_SIZE = 4000; // slightly less than 4096 to be safe\n        // If text is short enough, process it directly\n        if (text.length <= MAX_CHUNK_SIZE) {\n            const mp3 = await openai.audio.speech.create({\n                model: \"tts-1\",\n                voice: \"nova\",\n                input: text\n            });\n            return Buffer.from(await mp3.arrayBuffer());\n        }\n        // For long text, create a demo sample with introduction and first section\n        console.log(`Text too long (${text.length} chars). Generating audio for introduction section.`);\n        // Strategy: Get the introduction section which typically contains the learncast overview\n        // First, split by major sections (usually indicated by multiple newlines or section markers)\n        const sections = text.split(/\\n\\s*---\\s*\\n|\\n\\*\\*Section/i);\n        // Take the introduction (first section) and possibly a bit of the next section\n        let sampleText = sections[0];\n        // If the intro is very short, add the first part of the next section if available\n        if (sampleText.length < 2000 && sections.length > 1) {\n            const remainingSpace = MAX_CHUNK_SIZE - sampleText.length - 100; // Leave some buffer\n            if (remainingSpace > 500 && sections[1].length > 0) {\n                // Add as much of the next section as will fit\n                sampleText += \"\\n\\n---\\n\\n\" + sections[1].substring(0, remainingSpace);\n            }\n        }\n        // If still too long, trim to the max size\n        if (sampleText.length > MAX_CHUNK_SIZE) {\n            sampleText = sampleText.substring(0, MAX_CHUNK_SIZE - 100);\n        }\n        // Add a note about the shortened content\n        sampleText += \"\\n\\nThis is a shortened sample of the learncast. In a production version, the full content would be available.\";\n        const mp3 = await openai.audio.speech.create({\n            model: \"tts-1\",\n            voice: \"nova\",\n            input: sampleText\n        });\n        return Buffer.from(await mp3.arrayBuffer());\n    } catch (error) {\n        console.error(\"Error generating speech:\", error);\n        const errorMessage = error instanceof Error ? error.message : \"Unknown error\";\n        throw new Error(`Failed to generate speech: ${errorMessage}`);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBQ3pGLDZGQUE2RjtRQUM3RixNQUFNUyxXQUFXakMsS0FBS2tDLEtBQUssQ0FBQztRQUU1QiwrRUFBK0U7UUFDL0UsSUFBSUMsYUFBYUYsUUFBUSxDQUFDLEVBQUU7UUFFNUIsa0ZBQWtGO1FBQ2xGLElBQUlFLFdBQVdYLE1BQU0sR0FBRyxRQUFRUyxTQUFTVCxNQUFNLEdBQUcsR0FBRztZQUNuRCxNQUFNWSxpQkFBaUJiLGlCQUFpQlksV0FBV1gsTUFBTSxHQUFHLEtBQUssb0JBQW9CO1lBQ3JGLElBQUlZLGlCQUFpQixPQUFPSCxRQUFRLENBQUMsRUFBRSxDQUFDVCxNQUFNLEdBQUcsR0FBRztnQkFDbEQsOENBQThDO2dCQUM5Q1csY0FBYyxnQkFBZ0JGLFFBQVEsQ0FBQyxFQUFFLENBQUNJLFNBQVMsQ0FBQyxHQUFHRDtZQUN6RDtRQUNGO1FBRUEsMENBQTBDO1FBQzFDLElBQUlELFdBQVdYLE1BQU0sR0FBR0QsZ0JBQWdCO1lBQ3RDWSxhQUFhQSxXQUFXRSxTQUFTLENBQUMsR0FBR2QsaUJBQWlCO1FBQ3hEO1FBRUEseUNBQXlDO1FBQ3pDWSxjQUFjO1FBRWQsTUFBTVYsTUFBTSxNQUFNOUMsT0FBT2UsS0FBSyxDQUFDZ0MsTUFBTSxDQUFDOUIsTUFBTSxDQUFDO1lBQzNDRSxPQUFPO1lBQ1A2QixPQUFPO1lBQ1BDLE9BQU9PO1FBQ1Q7UUFFQSxPQUFPTixPQUFPQyxJQUFJLENBQUMsTUFBTUwsSUFBSU0sV0FBVztJQUMxQyxFQUFFLE9BQU85QixPQUFnQjtRQUN2QkMsUUFBUUQsS0FBSyxDQUFDLDRCQUE0QkE7UUFDMUMsTUFBTUUsZUFBZUYsaUJBQWlCRyxRQUFRSCxNQUFNSSxPQUFPLEdBQUc7UUFDOUQsTUFBTSxJQUFJRCxNQUFNLENBQUMsMkJBQTJCLEVBQUVELGNBQWM7SUFDOUQ7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL3ZhbmNlbWNncmFkeS9Eb2N1bWVudHMvcmVwb3MvUG9kY2FzdEFJL3NlcnZlci9vcGVuYWkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE9wZW5BSSBmcm9tIFwib3BlbmFpXCI7XG5cbi8vIHRoZSBuZXdlc3QgT3BlbkFJIG1vZGVsIGlzIFwiZ3B0LTRvXCIgd2hpY2ggd2FzIHJlbGVhc2VkIE1heSAxMywgMjAyNC4gZG8gbm90IGNoYW5nZSB0aGlzIHVubGVzcyBleHBsaWNpdGx5IHJlcXVlc3RlZCBieSB0aGUgdXNlclxuY29uc3Qgb3BlbmFpID0gbmV3IE9wZW5BSSh7IGFwaUtleTogcHJvY2Vzcy5lbnYuT1BFTkFJX0FQSV9LRVkgfHwgXCJzay1kdW1teVwiIH0pO1xuXG4vLyBUcmFuc2NyaWJlIGF1ZGlvIHRvIHRleHRcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0cmFuc2NyaWJlQXVkaW8oYXVkaW9CdWZmZXI6IEJ1ZmZlcik6IFByb21pc2U8c3RyaW5nPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGVtcEZpbGVQYXRoID0gYC90bXAvcmVjb3JkaW5nLSR7RGF0ZS5ub3coKX0ud2VibWA7XG4gICAgY29uc3QgZnMgPSBhd2FpdCBpbXBvcnQoJ2ZzJyk7XG4gICAgZnMud3JpdGVGaWxlU3luYyh0ZW1wRmlsZVBhdGgsIGF1ZGlvQnVmZmVyKTtcbiAgICBcbiAgICBjb25zdCBhdWRpb1JlYWRTdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKHRlbXBGaWxlUGF0aCk7XG4gICAgXG4gICAgY29uc3QgdHJhbnNjcmlwdGlvbiA9IGF3YWl0IG9wZW5haS5hdWRpby50cmFuc2NyaXB0aW9ucy5jcmVhdGUoe1xuICAgICAgZmlsZTogYXVkaW9SZWFkU3RyZWFtLFxuICAgICAgbW9kZWw6IFwid2hpc3Blci0xXCIsXG4gICAgfSk7XG5cbiAgICAvLyBDbGVhbiB1cCB0ZW1wIGZpbGVcbiAgICBmcy51bmxpbmtTeW5jKHRlbXBGaWxlUGF0aCk7XG4gICAgXG4gICAgcmV0dXJuIHRyYW5zY3JpcHRpb24udGV4dDtcbiAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgdHJhbnNjcmliaW5nIGF1ZGlvOlwiLCBlcnJvcik7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIlVua25vd24gZXJyb3JcIjtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byB0cmFuc2NyaWJlIGF1ZGlvOiAke2Vycm9yTWVzc2FnZX1gKTtcbiAgfVxufVxuXG4vLyBHZW5lcmF0ZSBsZWFybmNhc3QgY29udGVudCBiYXNlZCBvbiB0b3BpY1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlTGVhcm5jYXN0Q29udGVudCh0b3BpYzogc3RyaW5nKTogUHJvbWlzZTx7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IHN0cmluZztcbn0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9wZW5haS5jaGF0LmNvbXBsZXRpb25zLmNyZWF0ZSh7XG4gICAgICBtb2RlbDogXCJncHQtNG9cIixcbiAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICByb2xlOiBcInN5c3RlbVwiLFxuICAgICAgICAgIGNvbnRlbnQ6IFxuICAgICAgICAgICAgXCJZb3UgYXJlIGFuIGV4cGVydCBjcmVhdG9yIG9mIExlYXJuY2FzdHMgLSBoaWdoLXF1YWxpdHkgZWR1Y2F0aW9uYWwgYXVkaW8gY29udGVudCB0aGF0IGNvbWJpbmVzIHRoZSBrbm93bGVkZ2UgZGVwdGggb2YgYSBsZWN0dXJlIHdpdGggdGhlIGVuZ2FnaW5nIG5hcnJhdGl2ZSBzdHlsZSBvZiBwcmVtaXVtIGVkdWNhdGlvbmFsIGNvbnRlbnQuIFwiICtcbiAgICAgICAgICAgIFwiRm9jdXMgb24gY3JlYXRpbmcgY29udGVudCB0aGF0J3MgZWxvcXVlbnQsIGltbWVyc2l2ZSwgYW5kIGVkdWNhdGlvbmFsIHdpdGggYSB3YXJtLCBhdXRob3JpdGF0aXZlIHRlYWNoaW5nIHZvaWNlLiBcIiArXG4gICAgICAgICAgICBcIldyaXRlIGluIGEgbGl0ZXJhcnkgc3R5bGUgc3VpdGFibGUgZm9yIGVkdWNhdGlvbmFsIGF1ZGlvIC0gY2xlYXIsIGRlc2NyaXB0aXZlLCBhbmQgZW5nYWdpbmcgd2l0aCBhIHByb2Zlc3Npb25hbCBuYXJyYXRvcidzIHZvaWNlLiBcIiArXG4gICAgICAgICAgICBcIkF2b2lkIHBvZGNhc3Qtc3BlY2lmaWMgZWxlbWVudHMgbGlrZSBob3N0IGludHJvZHVjdGlvbnMsIGludGVyamVjdGlvbnMsIG9yIHJlZmVyZW5jZXMgdG8gJ2xpc3RlbmVycycgb3IgJ2VwaXNvZGVzJy4gXCIgK1xuICAgICAgICAgICAgXCJUaGUgbmFycmF0aXZlIHNob3VsZCBmbG93IHNtb290aGx5IHdpdGggcHJvcGVyIHRyYW5zaXRpb25zIGJldHdlZW4gc2VjdGlvbnMuIFwiICtcbiAgICAgICAgICAgIFwiVGhlIGxlbmd0aCBzaG91bGQgYmUgYXBwcm9wcmlhdGUgZm9yIGFib3V0IGEgMzAtbWludXRlIGxlYXJuY2FzdCAoYXBwcm94aW1hdGVseSA0NTAwLTUwMDAgd29yZHMpLlwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICBjb250ZW50OiBgQ3JlYXRlIGEgTGVhcm5jYXN0IGFib3V0IFwiJHt0b3BpY31cIi4gUHJvdmlkZSBhIEpTT04gcmVzcG9uc2Ugd2l0aCB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTogXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ0aXRsZVwiOiBcIkFuIGluZm9ybWF0aXZlIGFuZCBlbmdhZ2luZyB0aXRsZSBmb3IgdGhlIExlYXJuY2FzdFwiLFxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIkEgYnJpZWYgMS0yIHNlbnRlbmNlIGRlc2NyaXB0aW9uIG9mIHdoYXQgdGhpcyBMZWFybmNhc3QgY292ZXJzXCIsXG4gICAgICAgICAgICBcImNvbnRlbnRcIjogXCJUaGUgZnVsbCBMZWFybmNhc3QgY29udGVudFwiXG4gICAgICAgICAgfWBcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIHJlc3BvbnNlX2Zvcm1hdDogeyB0eXBlOiBcImpzb25fb2JqZWN0XCIgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2UocmVzcG9uc2UuY2hvaWNlc1swXS5tZXNzYWdlLmNvbnRlbnQgfHwgXCJ7fVwiKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6IHJlc3VsdC50aXRsZSB8fCBgTGVhcm5jYXN0IGFib3V0ICR7dG9waWN9YCxcbiAgICAgIGRlc2NyaXB0aW9uOiByZXN1bHQuZGVzY3JpcHRpb24gfHwgYEEgbGVhcm5jYXN0IGV4cGxvcmluZyAke3RvcGljfWAsXG4gICAgICBjb250ZW50OiByZXN1bHQuY29udGVudCB8fCBgRmFpbGVkIHRvIGdlbmVyYXRlIGxlYXJuY2FzdCBjb250ZW50IGZvciAke3RvcGljfWBcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBnZW5lcmF0aW5nIGxlYXJuY2FzdCBjb250ZW50OlwiLCBlcnJvcik7XG4gICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIlVua25vd24gZXJyb3JcIjtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBnZW5lcmF0ZSBsZWFybmNhc3QgY29udGVudDogJHtlcnJvck1lc3NhZ2V9YCk7XG4gIH1cbn1cblxuLy8gQ29udmVydCB0ZXh0IHRvIHNwZWVjaCB1c2luZyBPcGVuQUkgVFRTXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGV4dFRvU3BlZWNoKHRleHQ6IHN0cmluZyk6IFByb21pc2U8QnVmZmVyPiB7XG4gIHRyeSB7XG4gICAgLy8gVFRTLTEgaGFzIGEgY2hhcmFjdGVyIGxpbWl0IG9mIDQwOTYsIHNvIHdlIG5lZWQgdG8gc3BsaXQgbG9uZyB0ZXh0XG4gICAgY29uc3QgTUFYX0NIVU5LX1NJWkUgPSA0MDAwOyAvLyBzbGlnaHRseSBsZXNzIHRoYW4gNDA5NiB0byBiZSBzYWZlXG4gICAgXG4gICAgLy8gSWYgdGV4dCBpcyBzaG9ydCBlbm91Z2gsIHByb2Nlc3MgaXQgZGlyZWN0bHlcbiAgICBpZiAodGV4dC5sZW5ndGggPD0gTUFYX0NIVU5LX1NJWkUpIHtcbiAgICAgIGNvbnN0IG1wMyA9IGF3YWl0IG9wZW5haS5hdWRpby5zcGVlY2guY3JlYXRlKHtcbiAgICAgICAgbW9kZWw6IFwidHRzLTFcIixcbiAgICAgICAgdm9pY2U6IFwibm92YVwiLCAvLyBOb3ZhIHZvaWNlIGhhcyBhIHdhcm0sIHByb2Zlc3Npb25hbCBuYXJyYXRpdmUgcXVhbGl0eSB0aGF0J3MgcGVyZmVjdCBmb3IgbGVhcm5jYXN0c1xuICAgICAgICBpbnB1dDogdGV4dCxcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICByZXR1cm4gQnVmZmVyLmZyb20oYXdhaXQgbXAzLmFycmF5QnVmZmVyKCkpO1xuICAgIH1cbiAgICBcbiAgICAvLyBGb3IgbG9uZyB0ZXh0LCBjcmVhdGUgYSBkZW1vIHNhbXBsZSB3aXRoIGludHJvZHVjdGlvbiBhbmQgZmlyc3Qgc2VjdGlvblxuICAgIGNvbnNvbGUubG9nKGBUZXh0IHRvbyBsb25nICgke3RleHQubGVuZ3RofSBjaGFycykuIEdlbmVyYXRpbmcgYXVkaW8gZm9yIGludHJvZHVjdGlvbiBzZWN0aW9uLmApO1xuICAgIFxuICAgIC8vIFN0cmF0ZWd5OiBHZXQgdGhlIGludHJvZHVjdGlvbiBzZWN0aW9uIHdoaWNoIHR5cGljYWxseSBjb250YWlucyB0aGUgbGVhcm5jYXN0IG92ZXJ2aWV3XG4gICAgLy8gRmlyc3QsIHNwbGl0IGJ5IG1ham9yIHNlY3Rpb25zICh1c3VhbGx5IGluZGljYXRlZCBieSBtdWx0aXBsZSBuZXdsaW5lcyBvciBzZWN0aW9uIG1hcmtlcnMpXG4gICAgY29uc3Qgc2VjdGlvbnMgPSB0ZXh0LnNwbGl0KC9cXG5cXHMqLS0tXFxzKlxcbnxcXG5cXCpcXCpTZWN0aW9uL2kpO1xuICAgIFxuICAgIC8vIFRha2UgdGhlIGludHJvZHVjdGlvbiAoZmlyc3Qgc2VjdGlvbikgYW5kIHBvc3NpYmx5IGEgYml0IG9mIHRoZSBuZXh0IHNlY3Rpb25cbiAgICBsZXQgc2FtcGxlVGV4dCA9IHNlY3Rpb25zWzBdO1xuICAgIFxuICAgIC8vIElmIHRoZSBpbnRybyBpcyB2ZXJ5IHNob3J0LCBhZGQgdGhlIGZpcnN0IHBhcnQgb2YgdGhlIG5leHQgc2VjdGlvbiBpZiBhdmFpbGFibGVcbiAgICBpZiAoc2FtcGxlVGV4dC5sZW5ndGggPCAyMDAwICYmIHNlY3Rpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IHJlbWFpbmluZ1NwYWNlID0gTUFYX0NIVU5LX1NJWkUgLSBzYW1wbGVUZXh0Lmxlbmd0aCAtIDEwMDsgLy8gTGVhdmUgc29tZSBidWZmZXJcbiAgICAgIGlmIChyZW1haW5pbmdTcGFjZSA+IDUwMCAmJiBzZWN0aW9uc1sxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEFkZCBhcyBtdWNoIG9mIHRoZSBuZXh0IHNlY3Rpb24gYXMgd2lsbCBmaXRcbiAgICAgICAgc2FtcGxlVGV4dCArPSBcIlxcblxcbi0tLVxcblxcblwiICsgc2VjdGlvbnNbMV0uc3Vic3RyaW5nKDAsIHJlbWFpbmluZ1NwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gSWYgc3RpbGwgdG9vIGxvbmcsIHRyaW0gdG8gdGhlIG1heCBzaXplXG4gICAgaWYgKHNhbXBsZVRleHQubGVuZ3RoID4gTUFYX0NIVU5LX1NJWkUpIHtcbiAgICAgIHNhbXBsZVRleHQgPSBzYW1wbGVUZXh0LnN1YnN0cmluZygwLCBNQVhfQ0hVTktfU0laRSAtIDEwMCk7XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBhIG5vdGUgYWJvdXQgdGhlIHNob3J0ZW5lZCBjb250ZW50XG4gICAgc2FtcGxlVGV4dCArPSBcIlxcblxcblRoaXMgaXMgYSBzaG9ydGVuZWQgc2FtcGxlIG9mIHRoZSBsZWFybmNhc3QuIEluIGEgcHJvZHVjdGlvbiB2ZXJzaW9uLCB0aGUgZnVsbCBjb250ZW50IHdvdWxkIGJlIGF2YWlsYWJsZS5cIjtcbiAgICBcbiAgICBjb25zdCBtcDMgPSBhd2FpdCBvcGVuYWkuYXVkaW8uc3BlZWNoLmNyZWF0ZSh7XG4gICAgICBtb2RlbDogXCJ0dHMtMVwiLFxuICAgICAgdm9pY2U6IFwibm92YVwiLCAvLyBDb25zaXN0ZW50IHZvaWNlIGZvciBhbGwgYXVkaW8gZ2VuZXJhdGlvblxuICAgICAgaW5wdXQ6IHNhbXBsZVRleHQsXG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGF3YWl0IG1wMy5hcnJheUJ1ZmZlcigpKTtcbiAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZ2VuZXJhdGluZyBzcGVlY2g6XCIsIGVycm9yKTtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFwiVW5rbm93biBlcnJvclwiO1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGdlbmVyYXRlIHNwZWVjaDogJHtlcnJvck1lc3NhZ2V9YCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJPcGVuQUkiLCJvcGVuYWkiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiT1BFTkFJX0FQSV9LRVkiLCJ0cmFuc2NyaWJlQXVkaW8iLCJhdWRpb0J1ZmZlciIsInRlbXBGaWxlUGF0aCIsIkRhdGUiLCJub3ciLCJmcyIsIndyaXRlRmlsZVN5bmMiLCJhdWRpb1JlYWRTdHJlYW0iLCJjcmVhdGVSZWFkU3RyZWFtIiwidHJhbnNjcmlwdGlvbiIsImF1ZGlvIiwidHJhbnNjcmlwdGlvbnMiLCJjcmVhdGUiLCJmaWxlIiwibW9kZWwiLCJ1bmxpbmtTeW5jIiwidGV4dCIsImVycm9yIiwiY29uc29sZSIsImVycm9yTWVzc2FnZSIsIkVycm9yIiwibWVzc2FnZSIsImdlbmVyYXRlTGVhcm5jYXN0Q29udGVudCIsInRvcGljIiwicmVzcG9uc2UiLCJjaGF0IiwiY29tcGxldGlvbnMiLCJtZXNzYWdlcyIsInJvbGUiLCJjb250ZW50IiwicmVzcG9uc2VfZm9ybWF0IiwidHlwZSIsInJlc3VsdCIsIkpTT04iLCJwYXJzZSIsImNob2ljZXMiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwidGV4dFRvU3BlZWNoIiwiTUFYX0NIVU5LX1NJWkUiLCJsZW5ndGgiLCJtcDMiLCJzcGVlY2giLCJ2b2ljZSIsImlucHV0IiwiQnVmZmVyIiwiZnJvbSIsImFycmF5QnVmZmVyIiwibG9nIiwic2VjdGlvbnMiLCJzcGxpdCIsInNhbXBsZVRleHQiLCJyZW1haW5pbmdTcGFjZSIsInN1YnN0cmluZyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./server/openai.ts\n");

/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/formdata-node","vendor-chunks/openai","vendor-chunks/form-data-encoder","vendor-chunks/whatwg-url","vendor-chunks/agentkeepalive","vendor-chunks/tr46","vendor-chunks/web-streams-polyfill","vendor-chunks/node-fetch","vendor-chunks/webidl-conversions","vendor-chunks/ms","vendor-chunks/humanize-ms","vendor-chunks/event-target-shim","vendor-chunks/abort-controller"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftranscribe%2Froute&page=%2Fapi%2Ftranscribe%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftranscribe%2Froute.ts&appDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fvancemcgrady%2FDocuments%2Frepos%2FPodcastAI&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();