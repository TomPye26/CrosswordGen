import React, {useState} from "react";
import "./SettingsBar.css"

interface ToggleProps {
    label: string;
    onToggle: (newState: boolean) => void;
    defaultIsOn: boolean;
}

const ToggleSwitch: React.FC<ToggleProps> = ({label, onToggle, defaultIsOn=false}) => {
    
    const [isOn, setIsOn] = useState<boolean>(defaultIsOn);

    const handleToggle = () => {
        setIsOn(!isOn);
        onToggle(!isOn)
    }

    return (
        <div className="toggle-switch">
            <label>
                {label}
                <input
                    type="checkbox"
                    checked={isOn}
                    onChange={handleToggle}
                />
            </label>
        </div>
    )
} 


interface SettingsBarProps {
    toggleAutoCheckFunc: (newState: boolean) => void;
}

const SettingsBar: React.FC<SettingsBarProps> = ({ toggleAutoCheckFunc}) => {

    return (
        <div className="settings-bar">
            <ToggleSwitch 
                label="Auto-check"
                onToggle={toggleAutoCheckFunc}
                defaultIsOn={false}
            />
        </div>
    )
}

export default SettingsBar;