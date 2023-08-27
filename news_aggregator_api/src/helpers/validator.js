class validator {
    validPreferences = ["business","entertainment","general","health","science","sports","technology"];
    static validatePreferences(preferences){
        if(!Array.isArray(preferences)){
            return false;
        }

        for(preference of preferences){
            if(typeof preference !== 'string' || !validPreferences.includes(preference)) {
                return false;
            }
        }

        return true;
    }
}