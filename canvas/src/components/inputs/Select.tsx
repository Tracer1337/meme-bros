import { MenuItem, TextField } from "@mui/material"

export type Item = {
    label: string,
    value: string
}

type Props = React.ComponentProps<typeof TextField> & {
    options: Item[]
}

function Select({ options, ...rest }: Props) {
    return (
        <TextField select {...rest}>
            {options.map(({ label, value }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
            ))}
        </TextField>
    )
}

export default Select
