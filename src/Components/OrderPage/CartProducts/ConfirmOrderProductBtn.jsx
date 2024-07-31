import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_ORDER_PRODUCT } from "src/Data/constants";
import { SCREEN_SIZES } from "src/Data/globalVariables";
import { showAlert, updateAlertState } from "src/Features/alertsSlice";
import { updateProductsState } from "src/Features/productsSlice";
import { orderProductToolTipPos } from "src/Functions/componentsFunctions";
import useCurrentLang from "src/Hooks/App/useCurrentLang";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon";
import ToolTip from "../../Shared/MiniComponents/ToolTip";
import s from "./ConfirmOrderProductBtn.module.scss";

const ConfirmOrderProductBtn = ({ productName, translatedProduct }) => {
  const { removeOrderProduct } = useSelector((state) => state.products);
  const { isAlertActive, confirmPurpose } = useSelector((state) => state.alerts).confirm;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { windowWidth } = useGetResizeWindow();
  const [lang] = useCurrentLang();
  const [toolTipLeftPos, setToolTipLeftPos] = useState(
    orderProductToolTipPos(lang)
  );
  const [toolTipTopPos, setToolTipTopPos] = useState("50%");

  function updateToolTipPositions() {
    if (windowWidth <= SCREEN_SIZES.laptop) {
      setToolTipLeftPos("50%");
      setToolTipTopPos("-20px");
      return;
    }

    setToolTipLeftPos(orderProductToolTipPos(lang));
    setToolTipTopPos("50%");
  }

  function handleConfirmBtnClick() {
    showConfirmAlert(dispatch, productName, t, translatedProduct);
  }

  useEffect(() => {
    const isSelectedProduct = removeOrderProduct === productName;
    const isRemoveOrderProduct = confirmPurpose === REMOVE_ORDER_PRODUCT;

    updateToolTipPositions();

    if (isAlertActive && isSelectedProduct && isRemoveOrderProduct)
      showConfirmAlert(dispatch, productName, t, translatedProduct);
  }, [windowWidth, lang]);

  return (
    <button
      type="button"
      className={s.confirmButton}
      aria-label="Confirm received product"
      onClick={handleConfirmBtnClick}
    >
      <SvgIcon name="checked" />
      <ToolTip
        top={toolTipTopPos}
        left={toolTipLeftPos}
        content={t("tooltips.confirm")}
      />
    </button>
  );
};
export default ConfirmOrderProductBtn;

function showConfirmAlert(dispatch, productName, t, translatedProduct) {
  dispatch(
    showAlert({
      alertText: t("toastAlert.confirmOrderProduct", {
        translatedProduct: translatedProduct,
      }),
      alertState: "warning",
      alertType: "confirm",
    })
  );

  dispatch(
    updateAlertState({
      type: "confirm",
      key: "confirmPurpose",
      value: REMOVE_ORDER_PRODUCT,
    })
  );

  dispatch(
    updateProductsState({ key: "removeOrderProduct", value: productName })
  );
}
