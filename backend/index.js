
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const crypto = require("crypto");
const cors= require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: ["https://cfcopfrontend.vercel.app"],
        methods: ["POST","GET"],
        credentials: true
    }
));

dotenv.config({ path: "config.env" });
const port = process.env.PORT || 4000;
function sha512(data) {
    const hash = crypto.createHash("sha512");
    hash.update(data);
    return hash.digest("hex");
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/getcheaters', async (req, res) => {
    var APIkey = req.body.apikey; 
    var secret = req.body.secretkey; 
    console.log(APIkey);
    console.log(secret);
    var time = parseInt(Date.now() / 1000);
    var code =
        "936854/user.friends?apiKey=" +
        APIkey +
        "&onlyOnline=false&time=" +
        time +
        "#" +
        secret;

    code = sha512(code); 

    var base_url =
        "https://codeforces.com/api/user.friends?apiKey=" +
        APIkey +
        "&onlyOnline=false&time=" +
        time +
        "&apiSig=936854" +
        code;

    try {
        const response = await fetch(base_url);
        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(400).json({ success: false, message: data.comment });
        }

        let realdata = data.result;

        if (!Array.isArray(realdata)) {
            return res.status(400).json({ success: false, message: "Invalid data format received from API." });
        }

        let cheaters = [];

for (const c of realdata) {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${c}`);
    const result = await response.json();

    const solved = result.result
        .filter(submission => submission.author.participantType === 'CONTESTANT' || submission.author.participantType === 'OUT_OF_COMPETITION')
        .reduce((acc, submission) => {
            if (!acc[submission.contestId]) {
                acc[submission.contestId] = {
                    contestId: submission.contestId,
                    Problems: 0,
                    skippedProblems: 0
                };
            }
            acc[submission.contestId].Problems++;
            if (submission.verdict === 'SKIPPED') {
                acc[submission.contestId].skippedProblems++;
            }
            return acc;
        }, {});

    const cheatedContests = Object.values(solved)
        .filter(contest => {
            return contest.skippedProblems === contest.Problems;
        });

    if (cheatedContests.length > 0) {
        const cheaterObj = {
            cheaterName: c,
            contests: cheatedContests.map(contest => contest.contestId)
        };
        cheaters.push(cheaterObj);
    }
}

// Output the cheaters array
    cheaters.sort((a, b) => b.contests.length - a.contests.length);
    console.log(cheaters);


        res.json({
            success: true,
            cheaters: cheaters
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
