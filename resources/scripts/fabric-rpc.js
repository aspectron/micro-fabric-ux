
function dpc(t,fn) { if(typeof(t) == 'function') return setTimeout(t,0); else return setTimeout(fn,t); }

class FabricRPC {
    constructor(options){
        this.online = false;
        this.timeout  = 30;

        this.options = _.extend({
            path:'/rpc'
        }, options || {});

        this.init();
    }

    init() {
        this.initEvent();
        this.timeout = this.timeout || 30;
        this.connected = false;
        if (this.options.path)
          this.connect();
    }

    initEvent() {
        this.pending = { };
        this._req = 1;
        this.events = new FabricEvents();
    }

    connect(){
        if (this._connected || !this.options.path)
            return;
        this._connected = true;
        this.events.emitAsync('rpc-connecting');
        this.socket = io(this.options.origin+this.options.path, this.options.args || {});
        //console.log("this.options.args"+this.options.args)
        this.socket.on('ready', ()=>{
            this.online = true;
        })
        this.socket.on('connect', ()=>{
            console.log("RPC connected");
            this.events.emit('rpc-connect');
        })
        this.socket.on('connect_error', (err)=>{
            this.events.emit('rpc-connect-error', err);
        })
        this.socket.on('error', (err)=>{ 
            console.log("RPC error", arguments);
        	this.events.emit('rpc-error', err);
        })
        this.socket.on('offline', ()=>{
            //window.location.reload();
            this.events.emit('offline');
        })
        this.socket.on('disconnect', ()=>{ 
            this.online = false;
            console.log("RPC disconnected",arguments);
   			this.events.emit('rpc-disconnect');

            _.each(this.pending, function(info, id) {
                info.callback({ error : "Connection Closed"});
            })

            this.pending = { }
        })

        this.socket.on('user-login', (msg)=>{
            //window.location.reload();
        })
        this.socket.on('user-logout', (msg)=>{
            //window.location.reload();
        })

        this.socket.on('message', (msg)=>{
            if(this.trace) {
                if(this.trace === 1 || this.trace === true)
                    console.log('RPC ['+this.id+']:',msg.op);
                else
                if(this.trace === 2)
                    console.log('RPC ['+this.id+']:',msg.op,msg);                
            }
        	this.events.emit(msg.op, msg);
        })

        this.socket.on('rpc::response', (msg)=>{
            if(msg._resp && this.pending[msg._resp])
                this.pending[msg._resp].callback.call(this, msg.err, msg.resp);
            else
            if(!this.pending[msg._resp]) {
                console.log("RPC received unknown rpc callback (strange server-side retransmit?)");
            }
            delete this.pending[msg._resp];
        })

        var timeoutMonitor = ()=>{
            var ts = Date.now();
            var purge = [ ]
            _.each(this.pending, (info, id)=>{
                if(ts - info.ts > this.timeout * 1000) {
                    info.callback({ error : "Timeout "});
                    purge.push(id);
                }
            })
            _.each(purge, (id)=>{
                delete this.pending[id];
            })
            dpc(1000, timeoutMonitor);
        }
        dpc(1000, timeoutMonitor);
    }

    close(){
        if(this.socket)
            this.socket.close();
    }

    on(op, callback) {
        this.events.on(op, callback);
    }

    dispatch(msg, callback) {

        if(!callback)
            return this.socket.emit('message', msg);

        this.pending[this._req] = {
            ts : Date.now(),
            callback : (err, resp)=>{
                callback(err, resp);
            }
        }

        this.socket.emit('rpc::request', { 
            req : msg,
            _req : this._req,
        });

        this._req++;
    }
}

class FabricEvents{

    constructor(){

        this.events = { }
        this.listeners = null;
        this.refs = [];
        this.mevents = [];

        this.on('destroy', ()=>{
            _.each(this.mevents, (uuid)=>{
               this.off(uuid);
            });
        })
    }

    on(op, fn){
        if(!fn)
            throw new Error("events::on() - callback is required");
        var uuid = Date.now()+Math.random(1000, 9999);
        if(!this.events[op])
            this.events[op] = { }
        this.events[op][uuid] = fn;//{ uuid : uuid, fn : fn }
        this.refs[uuid] = op;
        return uuid;
    }

    mon(op, fn){
        var uuid = this.on(op, fn);
        this.mevents.push(uuid);
        return uuid;
    }

    off(uuid, op) {
        if (uuid) {
            var op = this.refs[uuid];
            delete this.refs[uuid];
            delete this.events[op][uuid];
        }else if (op) {
            _.each(this.events[op], function(fn, uuid){
                delete this.refs[uuid];
            });

            delete this.events[op];
        };
    }

    // this function supports 2 types of arguments.
    //single object that contains opcode { op : 'msg' } 
    // or
    // 'msg', args...
    emit(msg) {
        var me = this;
        
        var args = Array.prototype.slice.apply(arguments);

        if(typeof(msg) == 'string') {

            var orig = args.slice();
            args.shift();

            var list = this.events[msg];
            list && _.each(list, (fn)=>{
                fn.apply(this, args);
            })

            this.listeners && _.each(this.listeners, (listener)=>{
                listener.emit.apply(listener, orig);
            })
        }
        else {

            var list = this.events[msg.op];
            list && _.each(list, (fn) =>{
                fn.apply(this, args);
            })

            this.listeners && _.each(this.listeners, (listener)=>{
                listener.emit.apply(listener, args);
            })
        }
    }

    emitAsync(op) {
        dpc(()=>{
            this.emit(op);
        })
    }

    addListener(listener) {
        if(!this.listeners)
            this.listeners = [ ]
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = Array.prototype.slice.apply(this.listeners.indexOf(listener));
    }

    getListeners() {
        return this.listeners;
    }
}

//export {FabricRPC};

