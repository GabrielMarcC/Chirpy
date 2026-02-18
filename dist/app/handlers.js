export const handlerReadiness = (_, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200);
    res.send('OK');
};
