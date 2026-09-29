const mongoose = require("mongoose");
require("dotenv").config();

const Seat = require("./models/Seat");

const statusMap = {
    A3: "Reserved",
    A4: "Occupied",
    A5: "Occupied",

    B2: "Reserved",
    B4: "Occupied",
    B5: "Occupied",

    C1: "Occupied",
    C3: "Reserved",
    C4: "Occupied",

    D1: "Reserved",
    D3: "Occupied",
    D5: "Occupied"
};

const getSection = (row) => {

    if (row === "A" || row === "B") {
        return "Reading Hall";
    }

    if (row === "C") {
        return "Reference Hall";
    }

    return "Silent Zone";
};


const seedSeats = async () => {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB connected"
        );


        const existingCount =
            await Seat.countDocuments();


        if (existingCount > 0) {

            console.log(
                `Seat collection already contains ${existingCount} seat(s).`
            );

            console.log(
                "No seed data inserted."
            );

            await mongoose.disconnect();

            return;
        }


        const seatData = [];


        for (
            const row of ["A", "B", "C", "D"]
        ) {

            for (
                let number = 1;
                number <= 25;
                number++
            ) {

                const seatNumber =
                    `${row}${number}`;


                seatData.push({

                    seatNumber,

                    row,

                    section:
                        getSection(row),

                    status:
                        statusMap[
                            seatNumber
                        ] || "Available"

                });

            }

        }


        await Seat.insertMany(
            seatData
        );


        console.log(
            `${seatData.length} seats inserted successfully.`
        );


        await mongoose.disconnect();

        console.log(
            "MongoDB disconnected"
        );

    } catch (error) {

        console.error(
            "Seat seed error:",
            error
        );


        try {

            await mongoose.disconnect();

        } catch (disconnectError) {

            console.error(
                "Disconnect error:",
                disconnectError
            );

        }

    }

};


seedSeats();