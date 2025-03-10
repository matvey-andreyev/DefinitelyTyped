// Type definitions for passport-google-oauth 2.0
// Project: https://github.com/jaredhanson/passport-google-oauth2
// Definitions by: Yasunori Ohoka <https://github.com/yasupeke>
//                 Eduard Zintz <https://github.com/ezintz>
//                 Tan Nguyen <https://github.com/ngtan>
//                 Gleb Varenov <https://github.com/acerbic>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

import * as passport from "passport";
import * as express from "express";
import * as oauth2 from "passport-oauth2";

export type OAuth2StrategyOptionsWithoutRequiredURLs = Pick<
    oauth2._StrategyOptionsBase,
    Exclude<keyof oauth2._StrategyOptionsBase, "authorizationURL" | "tokenURL">
>;

export interface _StrategyOptionsBase extends OAuth2StrategyOptionsWithoutRequiredURLs {
    authorizationURL?: string | undefined;
    callbackURL?: string | undefined;
    clientID: string;
    clientSecret: string;
    scope?: string | string[] | undefined;
    tokenURL?: string | undefined;
    userProfileURL?: string | undefined;
}

export interface StrategyOptions extends _StrategyOptionsBase {
    passReqToCallback?: false | undefined;
}

export interface StrategyOptionsWithRequest extends _StrategyOptionsBase {
    passReqToCallback: true;
}

export interface Profile extends passport.Profile {
    profileUrl: string;

    _raw: string;
    _json: {
        sub: string;
        name: string;
        given_name: string;
        picture: string;
        email: string;
        email_verified: boolean;
        locale: string;
        hd?: string;
    };
}

export type VerifyCallback = (err?: string | Error | null, user?: Express.User, info?: any) => void;

export class Strategy extends oauth2.Strategy {
    constructor(
        options: StrategyOptions,
        verify: (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => void
    );
    constructor(
        options: StrategyOptions,
        verify: (
            accessToken: string,
            refreshToken: string,
            params: GoogleCallbackParameters,
            profile: Profile,
            done: VerifyCallback
        ) => void
    );
    constructor(
        options: StrategyOptionsWithRequest,
        verify: (
            req: express.Request,
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => void
    );
    constructor(
        options: StrategyOptionsWithRequest,
        verify: (
            req: express.Request,
            accessToken: string,
            refreshToken: string,
            params: GoogleCallbackParameters,
            profile: Profile,
            done: VerifyCallback
        ) => void
    );
}

// additional Google-specific options
export interface AuthenticateOptionsGoogle extends passport.AuthenticateOptions {
    accessType?: 'offline' | 'online' | undefined;
    prompt?: string | undefined;
    loginHint?: string | undefined;
    includeGrantedScopes?: boolean | undefined;
    display?: string | undefined;
    hostedDomain?: string | undefined;
    hd?: string | undefined;
    requestVisibleActions?: any;
    openIDRealm?: any;
}

export interface GoogleCallbackParameters {
    access_token: string;
    refresh_token?: string | undefined;
    id_token?: string | undefined;
    expires_in: number;
    scope: string;
    token_type: string;
}

// allow Google-specific options when using "google" strategy
declare module 'passport' {
    interface Authenticator<InitializeRet = express.Handler, AuthenticateRet = any, AuthorizeRet = AuthenticateRet, AuthorizeOptions = AuthenticateOptions> {
        authenticate(strategy: 'google', options: AuthenticateOptionsGoogle, callback?: (...args: any[]) => any): AuthenticateRet;
        authorize(strategy: 'google', options: AuthenticateOptionsGoogle, callback?: (...args: any[]) => any): AuthorizeRet;
    }
}
