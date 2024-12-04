import ADD_STORY_IMG from '../assets/images/add-story.png'
import NO_SEARCH_DATA_IMG from '../assets/images/no-search-data.webp'
import NO_FILTER_DATA_IMG from '../assets/images/no-filter-data.jpeg'


export const validateEmail = (email) => {
    const regex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(email);
}

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";
    
    for (let i=0; i < Math.min(words.length, 2); i++){
        initials = words[i][0]
    }
    
    return initials.toUpperCase();
}

export const getEmptyCardMessage = (filterType) => {
    switch(filterType) {
        case "search":
            return `no stories found matching your search`;
        
        case "date":
            return `no stories found matching given date range`
        
            default:
                return `Start creating your first travel story.click the
                        add button to start wriiting your thoughts.`;
    }
}

export const getEmptyCardImg = (filterType) => {
    switch(filterType){
        case "search":
            return NO_SEARCH_DATA_IMG;
        case "date":
            return NO_FILTER_DATA_IMG;
        default: 
            return ADD_STORY_IMG    
    }
}