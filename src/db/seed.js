const dbService = require("./index");

/**
 * Seed the database
 */
function seedShipments(req, res) {
    // create some shipments
    const data = [
        {
            id: 1,
            customer: "Lambert Huthart",
            address: "2156 Lakeland Lane",
            city: "Kedungcangkring",
            country: "Indonesia",
            estimatedDelivery: "25/06/2019"
        },
        {
            id: 2,
            customer: "Lanie Sieghard",
            address: "75859 Barnett Parkway",
            city: "Petrovsk",
            country: "Russia",
            estimatedDelivery: "29/01/2019"
        },
        {
            id: 3,
            customer: "Liam Mazey",
            address: "6666 Hanson Plaza",
            city: "Dawuhan",
            country: "Indonesia",
            estimatedDelivery: "12/09/2018"
        },
        {
            id: 4,
            customer: "Andonis Wickes",
            address: "835 Shelley Plaza",
            city: "Libertador General San Martín",
            country: "Argentina",
            estimatedDelivery: "23/06/2019"
        },
        {
            id: 5,
            customer: "Beck Ierland",
            address: "840 Colorado Parkway",
            city: "Boise",
            country: "United States",
            estimatedDelivery: "22/05/2019"
        },
        {
            id: 6,
            customer: "Baxy Konertz",
            address: "228 Mayer Crossing",
            city: "Julita",
            country: "Philippines",
            estimatedDelivery: "22/09/2018"
        },
        {
            id: 7,
            customer: "Sherlock Flaonier",
            address: "1290 Sutherland Court",
            city: "Chum Phuang",
            country: "Thailand",
            estimatedDelivery: "23/11/2018"
        },
        {
            id: 8,
            customer: "Laureen Dabnor",
            address: "049 Northwestern Court",
            city: "Gulbene",
            country: "Latvia",
            estimatedDelivery: "23/10/2018"
        },
        {
            id: 9,
            customer: "Merridie Daw",
            address: "7 Butterfield Drive",
            city: "Fais",
            country: "Micronesia",
            estimatedDelivery: "06/11/2018"
        },
        {
            id: 10,
            customer: "Archambault MacCallester",
            address: "9 Anniversary Point",
            city: "Choropampa",
            country: "Peru",
            estimatedDelivery: "28/04/2019"
        }
    ];

    let testdb = dbService.db("test");

    testdb.createCollection("shipments", function(err, res) {
        let shipments = testdb.collection("shipments");

        let batch = shipments.initializeOrderedBulkOp();

        data.forEach(shipment => {
            batch.insert(shipment);
        });

        batch.execute(function(err, result) {
            console.log(err);
            console.log(result);
        });
    });
}

module.exports = { seedShipments };
