// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import { Action } from "readium-desktop/common/models/redux";
import { IHighlightHandlerState } from "readium-desktop/common/redux/states/renderer/highlight";

export const ID = "READER_HIGHLIGHT_HANDLER_PUSH";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Payload extends Array<IHighlightHandlerState> {
}

export function build(...param: IHighlightHandlerState[]):
    Action<typeof ID, Payload> {

    return {
        type: ID,
        payload: param,
    };
}
build.toString = () => ID; // Redux StringableActionCreator
export type TAction = ReturnType<typeof build>;
