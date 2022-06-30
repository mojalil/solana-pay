import products from "./products.json"

export default function handler(req, res) {
  if(req.method === "GET") {
    const productNohashes = products.map(product => {
        const { hash, filename, ...rest} = product;
        return rest;
    });

    res.status(200).json(productNohashes);
}
    else {
        res.status(405).send(`Method ${req.method} not allowed`);
    }

 }