import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
const CircularLoading = () => {
  const classes = useStyles();
  return <CircularProgress className={classes.loading} />;
};
const useStyles = makeStyles({
  loading: {
    "&": {
      width: "240px !important",
      height: "240px !important",
    },
  },
});
export default CircularLoading;
