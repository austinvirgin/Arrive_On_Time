import { Linking, Platform } from 'react-native';

export function GetDirections(destination, mode = 'driving'){
    const enc = encodeURIComponent;
    destination = `${destination}`

    if (Platform.OS === 'ios'){
        return Linking.openURL(`http://maps.apple.com/?daddr=${enc(destination)}&dirflg=${modeFlag(mode)}`);
    }
    else {
        return Linking.openURL(`google.navigation:q=${enc(destination)}&mode=${modeFlag(mode, type = "google")}`);
    }
}

function modeFlag(mode, type = 'ios') {
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