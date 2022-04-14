import navigation from "../_nav";
import navigationProfesi from "../_nav_profesi";
import navigationBendahara from "../_nav_bendahara";
import navigationKeanggotaan from "../_nav_keanggotaan";

export default class SihapeiUtils {
  static getActiveNav = (role) =>{

    let selectedNav = navigation

    if(role === "PROFESI"){
      selectedNav = navigationProfesi
    }
    if(role === "BENDAHARA"){
      selectedNav = navigationBendahara
    }
    if(role === "KEANGGOTAAN"){
      selectedNav = navigationKeanggotaan
    }

    return selectedNav

  }
}
