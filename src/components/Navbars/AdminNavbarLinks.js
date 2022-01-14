import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// import { Manager, Target, Popper } from "react-popper";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons

// core components

import styles from "assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  //const [openNotification, setOpenNotification] = React.useState(null);
  //const [openProfile, setOpenProfile] = React.useState(null);
  //TODO: Implement logout call
  //const { setUser } = useContext(AuthContext);
  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setUser(null);
  // };
  // const history = useHistory();
  const classes = useStyles();
  const { rtlActive } = props;
  // const searchButton =
  //   classes.top +
  //   " " +
  //   classes.searchButton +
  //   " " +
  //   classNames({
  //     [classes.searchRTL]: rtlActive,
  //   });
  // const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
  //   [classes.dropdownItemRTL]: rtlActive,
  // });
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive,
  });
  // const managerClasses = classNames({
  //   [classes.managerClasses]: true,
  // });
  return (
    <div className={wrapper}>
      {/* <CustomInput
        rtlActive={rtlActive}
        formControlProps={{
          className: classes.top + " " + classes.search,
        }}
        inputProps={{
          placeholder: rtlActive ? "بحث" : "Search",
          inputProps: {
            "aria-label": rtlActive ? "بحث" : "Search",
            className: classes.searchInput,
          },
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        className={searchButton}
      >
        <Search className={classes.headerLinksSvg + " " + classes.searchIcon} />
      </Button> */}
    </div>
  );
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool,
};
