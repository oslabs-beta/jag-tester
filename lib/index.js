"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getMiddleware(app) {
    var collectedData = {};
    var isPrototypeChanged = false;
    var Jagtestercommands;
    (function (Jagtestercommands) {
        Jagtestercommands[Jagtestercommands["running"] = 0] = "running";
        Jagtestercommands[Jagtestercommands["endTest"] = 1] = "endTest";
        Jagtestercommands[Jagtestercommands["resetCollectedData"] = 2] = "resetCollectedData";
    })(Jagtestercommands || (Jagtestercommands = {}));
    var resetLayerPrototype = function () {
        app._router.stack[0].__proto__.handle_request =
            originalLayerHandleRequest;
        isPrototypeChanged = false;
    };
    var updateLayerPrototype = function () {
        app._router.stack[0].__proto__.handle_request = newLayerHandleRequest;
        isPrototypeChanged = true;
    };
    var originalLayerHandleRequest = function handle(req, res, next) {
        var fn = this.handle;
        if (fn.length > 3) {
            // not a standard request handler
            return next();
        }
        try {
            fn(req, res, next);
        }
        catch (err) {
            next(err);
        }
    };
    var newLayerHandleRequest = function handle(req, res, next) {
        var fn = this.handle;
        if (fn.length > 3) {
            // not a standard request handler
            return next();
        }
        try {
            var beforeFunctionCall_1 = Date.now(), fnName = this.name, reqId_1 = req.headers.jagtesterreqid.toString(), reqRoute = req.url;
            // create a data object in the collected data if it doesnt already exist
            if (!collectedData[reqId_1]) {
                collectedData[reqId_1] = {
                    reqId: reqId_1,
                    reqRoute: reqRoute,
                    middlewares: [],
                };
            }
            // add layer information to the collectedData
            collectedData[reqId_1].middlewares.push({
                fnName: fnName,
                elapsedTime: 0,
            });
            // call the middleware and time it in the next function
            fn(req, res, function () {
                var lastElIndex = collectedData[reqId_1].middlewares.length - 1;
                collectedData[reqId_1].middlewares[lastElIndex].elapsedTime =
                    Date.now() - beforeFunctionCall_1;
                next();
            });
        }
        catch (err) {
            next(err);
        }
    };
    // this is the actual middleware that will take jagtestercommands
    return function (req, res, next) {
        // getting the command
        var jagtestercommand = +req.headers.jagtestercommand;
        switch (jagtestercommand) {
            //changing the prototype of the layer handle request
            case Jagtestercommands.running:
                !isPrototypeChanged && updateLayerPrototype();
                break;
            //reset the prototype and send back json data
            case Jagtestercommands.endTest:
                var copiedData = JSON.parse(JSON.stringify(collectedData));
                isPrototypeChanged && resetLayerPrototype();
                return res.json(copiedData);
            //reset the colleceted data
            case Jagtestercommands.resetCollectedData:
                collectedData = {};
                break;
            default:
                // changing layer prototype back to original
                isPrototypeChanged && resetLayerPrototype();
                break;
        }
        return next();
    };
}
module.exports = getMiddleware;