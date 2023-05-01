export class PromiseQueue {

    constructor() {
        /** @private */ this.job = undefined;
        /** @private */ this.queue = []
    }

    /** @private */
        run() {
            if(this.job) return;

            this.job = this.queue.shift();
            if(!this.job) return;

            this.job.f.apply(this.job.c, this.job.a)
                .then( this.job.r )
                .catch( this.job.e )
                .finally( () => {
                    this.job = undefined;
                    setTimeout( () => this.run(), 0 )
                } )
        }

    add(context, fnc, ...args) {
        return new Promise((resolve, reject) => {
            this.queue.push({c: context, f: fnc, a: args, r: resolve, e: reject});
            this.run();
        })
    }


};

export default PromiseQueue;
