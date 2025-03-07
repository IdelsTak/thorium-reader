// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

// import * as ramda from "ramda";
// import { ActionWithSender } from "readium-desktop/common/models/sync";
import { UnknownAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { createPatch } from "rfc6902";
import { winActions } from "../actions";
import { patchChannel } from "../sagas/patch";

import { PersistRootState, RootState } from "../states";

export const reduxPersistMiddleware: Middleware
    = (store: MiddlewareAPI<Dispatch<UnknownAction>, RootState>) =>
        (next: (action: unknown) => unknown) => // Dispatch<ActionWithSender>
            (action: unknown): unknown => { // ActionWithSender

                const prevState = store.getState();

                const returnValue = next(action);

                const nextState = store.getState();

                const persistPrevState: PersistRootState = {
                    win: prevState.win,
                    reader: prevState.reader,
                    i18n: prevState.i18n,
                    session: prevState.session,
                    publication: {
                        db: prevState.publication.db,
                        lastReadingQueue: prevState.publication.lastReadingQueue,
                    },
                    opds: prevState.opds,
                    version: prevState.version,
                };

                const persistNextState: PersistRootState = {
                    win: nextState.win,
                    reader: nextState.reader,
                    i18n: nextState.i18n,
                    session: nextState.session,
                    publication: {
                        db: nextState.publication.db,
                        lastReadingQueue: nextState.publication.lastReadingQueue,
                    },
                    opds: nextState.opds,
                    version: nextState.version,
                };

                const ops = createPatch(persistPrevState, persistNextState);
                if (ops?.length) {
                    for (const o of ops) {
                        patchChannel.put(o);
                    }
                    // We have to dispatch an action because the buffer fifo queue of saga (signal)
                    // can not allow to trigger a function when data is available and then flush it.
                    // We can't start a trigger on buffer new data.
                    // Each data in the fifo queue can be triggered with a take + data exploitation.
                    // But in your case we expect a generic flushable function.
                    store.dispatch(winActions.persistRequest.build(ops));
                }

                return returnValue;
            };
