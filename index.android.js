import React, { AppRegistry, Component, Navigator, DrawerLayoutAndroid, ScrollView, View, Text } from 'react-native';

import { Toolbar } from './src/components';

import Navigation from './src/scenes/Navigation';
import Alarms from './src/scenes/Alarms';

class Application extends Component {

    static childContextTypes = {
        drawer: React.PropTypes.object,
        navigator: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            drawer: null,
            navigator: null
        };
    }

    getChildContext = () => {
        return {
            drawer: this.state.drawer,
            navigator: this.state.navigator
        }
    };


    setDrawer = (drawer) => {
        this.setState({
            drawer
        });
    };

    setNavigator = (navigator) => {
        this.setState({
            navigator
        });
    };

    render() {
        const { drawer, navigator } = this.state;

        const navView = React.createElement(Navigation);

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => {
                    if (drawer && navigator) {
                        return navView;
                    }
                    return null;
                }}
                ref={(drawer) => { !this.state.drawer ? this.setDrawer(drawer) : null }}
            >
                {drawer &&
                <Navigator
                    key='app-nav-bar'
                    initialRoute={{ name: 'Alarms', component: Alarms }}
                    navigationBar={<Toolbar onIconPress={drawer.openDrawer} />}
                    configureScene={() => {
                            return Navigator.SceneConfigs.FadeAndroid;
                        }}
                    ref={(navigator) => { !this.state.navigator ? this.setNavigator(navigator) : null }}
                    renderScene={(route, navigator) => {
                            if (this.state.navigator && route.component) {
                                return (
                                    <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
                                        <route.component route={route} navigator={navigator} />
                                    </ScrollView>
                                );
                            }
                        }}
                />
                }
            </DrawerLayoutAndroid>
        );
    }
}

AppRegistry.registerComponent('ReactAlarmClock', () => Application);

const styles = {
    scene: {
        marginTop: 56,
        paddingBottom: 56
    }
};