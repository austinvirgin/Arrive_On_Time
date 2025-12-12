import { Linking, Platform } from 'react-native';

export function GetDirections(destination, mode = 'driving'){

    // Use the encoder
    const enc = encodeURIComponent;

    // Make sure the destination is a string
    destination = `${destination}`

    if (Platform.OS === 'ios'){

        // If the platform used is apple open apple maps
        return Linking.openURL(`http://maps.apple.com/?daddr=${enc(destination)}&dirflg=${modeFlag(mode)}`);
    }
    else {
        // Otherwise open google maps
        const os = "google"
        return Linking.openURL(`google.navigation:q=${enc(destination)}&mode=${modeFlag(mode, os)}`);
    }
}

function modeFlag(mode, type = 'ios') {
    // Set the made based on ios or google
    if (mode == 'driving'){
        return 'd'
    }
    if (mode == 'walking'){
        return 'w'
    }
    if (mode == 'bicycling'){
        if (type === 'google'){
            return 'b'
        }
        return 'd'
    }
}