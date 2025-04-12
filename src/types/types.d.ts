declare global{
    namespace Express{
        interface Request{
            lang?: string;
        }
    }
}