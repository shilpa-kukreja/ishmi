import subscribeModel from "../models/subscribeModel.js";

// Add Subscriber API
const addSubscriber = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required!" });

    try {
        const existingSubscriber = await subscribeModel.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ message: "Email is already subscribed!" });
        }

        const newSubscriber = new subscribeModel({ email });
        await newSubscriber.save();
        res.status(201).json({ message: "Subscription successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get All Subscribers API
const allSubscriber = async (req, res) => {
    try {
        const subscribers = await subscribeModel.find();
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete Subscriber API
const deleteSubscriber = async (req, res) => {
    const { email } = req.params;

    try {
        const deletedSubscriber = await subscribeModel.findOneAndDelete({ email });
        if (!deletedSubscriber) {
            return res.status(404).json({ message: "Email not found!" });
        }
        res.status(200).json({ message: "Unsubscribed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export { addSubscriber, allSubscriber, deleteSubscriber };
