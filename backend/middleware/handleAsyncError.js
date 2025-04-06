export default (myErrorFn) => (req, res, next) => {
    Promise.resolve(myErrorFn(req, res, next)).catch(next );        
}