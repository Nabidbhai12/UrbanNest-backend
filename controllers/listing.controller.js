import Listing from '../models/listing.model.js';
export const getListingsByType = async (req, res) => {
  try {
    // Assuming 'userId' is obtained from request params, query or authentication middleware (like JWT)
    const userId = req.params.userId; // Extracting userId from URL parameter
    // Fetch the lists concurrently
    const [wishlist, rented, bought] = await Promise.all([
      Listing.find({ postedBy: userId, listingType: 'wishlist' }).lean(),
      Listing.find({ postedBy: userId, listingType: 'rented' }).lean(),
      Listing.find({ postedBy: userId, listingType: 'bought' }).lean()
    ]);
    console.log("call made");
    console.log(wishlist, rented, bought);

    // Send the listings back to the client
    res.json({ wishlist, rented, bought });
  } catch (err) {
    // Error handling
    res.status(500).json({ message: err.message });
  }
};

export const addListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    //add it to the selling list of that user.
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
