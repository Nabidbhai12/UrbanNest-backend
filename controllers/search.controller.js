import Listing from '../models/listing.model.js';
import { ObjectId } from 'mongodb';
 // Adjust the path as necessary
 export const searchProperties = async (req, res, next) => {
    console.log("from search");
    console.log(req.body);

    try {
        const {
            saleType,
            propertyType,
            condition,
            district,
            area,
            areaRange_min,
            areaRange_max,
            priceRange_min,
            priceRange_max,
            beds,
            baths,
            apartmentType,
        } = req.body;

        // Base query with exact matches for saleType, propertyType, condition, district, and area
        let baseQuery = {
            ...(saleType && { propertyStatus: saleType === "sell" ? 'For Sale' : 'For Rent' }),
            ...(propertyType && { propertyType }),
            ...(condition && { condition }),
            ...(district && { 'location.district': district }),
            ...(area && { 'location.area': area }),
        };

        // Additional criteria for $or logic
        let orConditions = [];

        // Price Range
        if (priceRange_min || priceRange_max) {
            const priceCondition = {};
            if (priceRange_min) priceCondition['price.amount'] = { '$gte': parseInt(priceRange_min) };
            if (priceRange_max) {
                priceCondition['price.amount'] = priceCondition['price.amount'] || {};
                priceCondition['price.amount']['$lte'] = parseInt(priceRange_max);
            }
            orConditions.push(priceCondition);
        }

        // Area Range
        if (areaRange_min || areaRange_max) {
            const areaCondition = {};
            if (areaRange_min) areaCondition['size'] = { '$gte': parseInt(areaRange_min) };
            if (areaRange_max) {
                areaCondition['size'] = areaCondition['size'] || {};
                areaCondition['size']['$lte'] = parseInt(areaRange_max);
            }
            orConditions.push(areaCondition);
        }

        // Bedrooms and Bathrooms
        if (beds) {
            orConditions.push({ 'rooms.bedrooms': { '$gte': parseInt(beds) } });
        }
        if (baths) {
            orConditions.push({ 'rooms.bathrooms': { '$gte': parseInt(baths) } });
        }

        // Apartment Type
        if (apartmentType) {
            orConditions.push({ apartmentType: apartmentType });
        }

        // Combine baseQuery with orConditions if there are any
        const finalQuery = orConditions.length ? [{ $match: baseQuery }, { $match: { $or: orConditions } }] : [{ $match: baseQuery }];

        const properties = await Listing.aggregate(finalQuery);

        console.log("searching...");

        // Assuming the aggregation correctly filters the documents, no need for further processing
        console.log("done searching...");

        res.status(200).json(properties);
    } catch (error) {
        console.error("Error in property search:", error);
        next(error);
    }
};

//check whether the search works properly or not

export const getListingById = async (req, res, next) => {
    console.log("getListingById called");
    const { listingId } = req.params; // Assuming the ID is passed as a URL parameter

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.json(listing);
    } catch (error) {
        next(error);
    }
};



  