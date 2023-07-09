interface RatingParams {
    id: number;
    rating: number;
    bookId: number;
    userId: number;
}

class Rating implements RatingParams {
    id: number;
    rating: number;
    bookId: number;
    userId: number;
    
    constructor(ratingParams: RatingParams) {
        for (let [key, value] of Object.entries(ratingParams)) {
            this[key] = value;
        }
    }
}

class RatingManager {
    ratings: Map<number, Rating> = new Map();

    createNewRating(ratingParams: Omit<RatingParams, "id">): Rating {
        const lastId = this.ratings.size;
        const rating = new Rating({id: lastId, ...ratingParams});
        return rating;
    }

    setRating(rating: Rating) {
        this.ratings.set(rating.id, rating);
    }

    removeRating(ratingId): boolean {
        if (this.ratings.has(ratingId)) {
            this.ratings.delete(ratingId);
            return true;
        }
        return false;
    }

    editRating(
        ratingId: number,
        newRatingParams: Partial<Omit<RatingParams, "id">>
    ): boolean {
        const editedRating = this.ratings.get(ratingId);
        if (editedRating === undefined)
            return false;
        
        for (let [key, value] of Object.entries(newRatingParams))
            editedRating[key] = value;
        return true;
    }

    getAllRatings(): Rating[] {
        return Object.values(Object.fromEntries(this.ratings));
    }

    findRatings(ratingParams: Partial<Omit<RatingParams, "id">>): Rating[] {
        let ratings = this.getAllRatings();
        for (let [key, value] of Object.entries(ratingParams)) {
            ratings = ratings.filter( rating => rating[key] === value);
        }
        return ratings;
    }

    getBookAverageRating(bookid): number {
        const bookratings = this.findRatings({bookId: bookid.id});
        return bookratings.reduce((sum, rating) => sum + rating.rating , 0) / bookratings.length;
    }
}

export {RatingParams, Rating, RatingManager };
