import React, { Component, View, Text, Image, IntentAndroid } from 'react-native';
import { Card, Button, COLOR, TYPO } from 'react-native-material-design';

import AppStore from '../stores/AppStore';

export default class About extends Component {

    render() {
        const theme = AppStore.getState().theme;
        const gitHubUrl = 'https://github.com/underover/react-native-alarmclock';
        const reactNativeUrl = 'https://facebook.github.io/react-native/';

        return (
            <View>
                <Card>
                    <Card.Body>
                       <Text style={[TYPO.paperFontHeadline, COLOR.paperGrey500]}>React Native Alarm Clock</Text>
                       <Text>This application uses the framework "React Native" from Facebook.
                       The Material Design styles for React Native are also being leveraged.</Text>
                    </Card.Body>
                    <Card.Actions>
                        <Button primary={theme} raised={true} value="MATERIAL STYLES" onPress={() => IntentAndroid.openURL('https://github.com/binggg/react-native-material-design-styles')} />
                        <Button primary={theme} raised={true} value="REACT NATIVE" onPress={() => IntentAndroid.openURL(reactNativeUrl)} />
                    </Card.Actions>
                </Card>
                <Card>
                    <Card.Body>
                        <Text>If you find any issues or potential improvements please submit an issue on the GitHub repository page.</Text>
                        <Button primary={theme}raised={true} value="CREATE ISSUE" onPress={() => IntentAndroid.openURL(gitHubUrl)} />
                        <Button primary={theme} raised={true} value="SEE CODE" onPress={() => IntentAndroid.openURL(gitHubUrl)} />
                    </Card.Body>
                </Card>
            </View>
        );
    }

}