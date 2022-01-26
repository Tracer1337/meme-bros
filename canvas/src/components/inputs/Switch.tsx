import { FormControlLabel, Switch as MuiSwitch } from "@mui/material"

type Props = React.ComponentProps<typeof MuiSwitch> & {
    label: string
}

function Switch({ label, ...rest }: Props) {
    return (
        <FormControlLabel
            label={label}
            control={<MuiSwitch {...rest} />}
        />
    )
}

export default Switch
