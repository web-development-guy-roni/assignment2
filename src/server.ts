// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import appPromise from "./app";

const port = process.env.PORT || 3000;

appPromise.then((app) => {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
});