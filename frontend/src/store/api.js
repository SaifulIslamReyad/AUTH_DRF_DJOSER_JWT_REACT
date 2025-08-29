import { createAction } from "@reduxjs/toolkit";
export const apiCallBegun = createAction("api/callBegun");
export const apiCallSuccess = createAction("api/callSuccess");
export const apiCallFailed = createAction("api/callFailed");


// generic api actions  
// These are generic actions for API requests.
// They allow your api middleware to know:
// When an API request starts (apiCallBegun)
// When it succeeds (apiCallSuccess)
// When it fails (apiCallFailed)
// Keeps API request handling centralized and consistent.