const SUQIAN_HOST_URI = "http://xxks.goat.msns.cn:5088/api/";
const SUQIAN_IMG_URI = "http://xxks.goat.msns.cn:5088/";

//error相关
const REQUEST_ERROR_DESC = "请求失败，请检查您的网络！";
var LOGIN = "account/login_act"; //登录
var REGISTER = "account/regUser"; //注册
var SEND_BIND_MOBILE_CODE = "account/sendBindMobileCode"; //获取短信验证码接口
var RESET_PASSWORD_MOBILE = "account/reset_password_mobile"; //重置密码
var ACCOUNT_RESETMOBILECODE = "account/resetMobileCode"; //获取重置密码短信验证码
var WX_LOGIN = "account/oauth_callback";

var SEARCH_COMPANY = "company/findCompanyList"; //搜索企业接口
var SEARCH_GW = "company/getGWCateList"; //搜索岗位接口
var JOIN_CINOANY = "company/joinCompany"; //搜索岗位接口

var STUDY_CATELIST = "study/cateList"; //学习分类
var STUDY_LOAD_MORE = "study/loadMoreStudy"; //学习内容列表
var STUDY_DETAIL = "study/studyDetail"; //学习内容详情
var STUDY_SEARCHSTUDY = "study/searchStudy"; //学习搜索
var STUDY_SUBMITSTUDY = "study/submitStudy"; //学习积分
var STUDY_FAVLIST = "study/favList"; //收藏列表
var STUDY_ADDFAV = "study/addFav"; //加入收藏
var STUDY_DELFAV = "study/delFav"; //删除收藏
var STUDY_HOME = "study/home"; //删除收藏
var STUDY_LIKE = "study/likeArticle"; //喜欢
var STUDY_IMPORT = "study/importArticle"; //喜欢



var EXAM_GETEXAMTYPE = "exam/getExamType"; //获取考试类型
var EXAM_GETPAPERBYTYPE = "exam/getPaperByType"; //获取试卷列表
var EXAM_EXAMRECODLIST = "exam/examRecodList"; //考试记录
var EXAM_GENPAPAER = "exam/genPapaer"; //获取考题
var EXAM_SUBMITPAPER = "exam/submitPaper"; //提交试卷
var EXAM_INDEX = "exam/index"; //答题首页面
var EXAM_EXAMRECODDATAS = "exam/examRecodDatas";
var EXAM_MYERRORS = "exam/myerror";
var EXAM_POOLS = "exam/questionPool";
var EXAM_QUESTIONLIST = "exam/questionList";



var UCENTER_POINTBAND = "ucenter/pointBand"; //积分榜单
var UCENTER_POINTLIST = "ucenter/pointList"; //积分记录
var UCENTER_USERINFO = "ucenter/userInfo"; //个人信息
//var UCENTER_SUGGESTION = "ucenter/suggestion"; //建议
var UCENTER_POINTTASKLIST = "ucenter/pointTaskList"; //积分面板
var UCENTER_CHANGELOGO = "ucenter/changeLogo"; //修改头像
var UCENTER_POINTLISTBYDAY = "ucenter/pointListByDay"; //按天积分记录

var INITWXJSCONFIG = "tools/initWXJSConfig"; //获取微信jssdk配置
var UCENTER_SUGGESTION = "tools/suggestion"; //建议
var TOOLS_HELP = "tools/helpinfo"; //帮助

// #ifdef APP-PLUS
var APP_VERSION =  plus.runtime.version; //版本号
// #endif
// #ifdef !APP-PLUS
var APP_VERSION =  '1.0.5'; //版本号
// #endif

export default {
	APP_VERSION,
	SUQIAN_HOST_URI,
	SUQIAN_IMG_URI,
	LOGIN,
	WX_LOGIN,
	REGISTER,
	SEND_BIND_MOBILE_CODE,
	REQUEST_ERROR_DESC,
	SEARCH_COMPANY,
	SEARCH_GW,
	JOIN_CINOANY,
	REQUEST_ERROR_DESC,
	STUDY_CATELIST,
	STUDY_LOAD_MORE,
	STUDY_DETAIL,
	EXAM_GETEXAMTYPE,
	EXAM_GETPAPERBYTYPE,
	UCENTER_POINTBAND,
	UCENTER_USERINFO,
	UCENTER_SUGGESTION,
	UCENTER_POINTLIST,
	EXAM_EXAMRECODLIST,
	EXAM_GENPAPAER,
	EXAM_SUBMITPAPER,
	EXAM_INDEX,
	UCENTER_POINTTASKLIST,
	STUDY_SEARCHSTUDY,
	STUDY_SUBMITSTUDY,
	UCENTER_CHANGELOGO,
	RESET_PASSWORD_MOBILE,
	ACCOUNT_RESETMOBILECODE,
	EXAM_EXAMRECODDATAS,
	UCENTER_POINTLISTBYDAY,
	STUDY_FAVLIST,
	STUDY_ADDFAV,
	STUDY_DELFAV,
	STUDY_HOME,
	REQUEST_ERROR_DESC,
	INITWXJSCONFIG,
	STUDY_LIKE,
	TOOLS_HELP,
	EXAM_MYERRORS,
	EXAM_POOLS,
	EXAM_QUESTIONLIST,
	STUDY_IMPORT
}
