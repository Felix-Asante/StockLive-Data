import React from "react";
import { useMutation } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { PieChartOutlined } from "@ant-design/icons";
import { BiDroplet } from "react-icons/bi";

import { getUserProfileData } from "../../services/auth";
import { userProfileData, userWalletCredit } from "../../recoils/profile";

import "./Dashboard.css";

export default function Dashboard() {
  const {
    mutate: userProfileMutation,
    data: fetchedUserProfileData,
    isSuccess: sucessfullyFetchedProfileData,
  } = useMutation((data) => getUserProfileData(data));
  const [profileData, setProfileData] = useRecoilState(userProfileData);
  const userTotalWalletCredit = useRecoilValue(userWalletCredit);
  const token = localStorage.getItem("nseAuthToken");

  React.useEffect(() => {
    userProfileMutation({
      token: token,
    });
  }, [userProfileMutation, token]);

  React.useEffect(() => {
    if (sucessfullyFetchedProfileData)
      setProfileData(fetchedUserProfileData?.data?.user);
  }, [sucessfullyFetchedProfileData, fetchedUserProfileData, setProfileData]);

  return (
    <>
      <div className="dashboard-layout" style={{ height: "100%" }}>
        {profileData && (
          <h1 className="username-title">
            Hi, <span className="nickname">{profileData?.full_name}</span>
          </h1>
        )}
        <div
          className="margins-stats stats-block"
          style={{
            paddingLeft: "8px",
            paddingTop: "16px",
            paddingBottom: "50px",
          }}
        >
          <div className="row">
            <div className="six columns margin-block first">
              <div className="secondary-title">
                <PieChartOutlined />
                <span>equity</span>
              </div>
              <div className="row">
                <div className="primary-stats five columns m5">
                  <div className="value">
                    <span
                      data-balloon={`₹${userTotalWalletCredit}`}
                      data-balloon-pos="up"
                    >
                      {profileData && profileData?.credit}
                    </span>
                  </div>
                  <div className="label">Margin available</div>
                </div>
                <div className="secondary-stats seven columns m7">
                  <div className="block">
                    <span className="label">Margins used</span>{" "}
                    <span className="value">
                      <span data-balloon="₹0.00" data-balloon-pos="up">
                        0
                      </span>
                    </span>
                  </div>
                  <div className="block">
                    <span className="label">Opening balance</span>{" "}
                    <span className="value">
                      <span data-balloon="₹32.87" data-balloon-pos="up">
                        32.87
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="six columns margin-block">
              <div className="secondary-title">
                <BiDroplet /> <span>Commodity</span>
              </div>
              <div className="row">
                <div className="primary-stats five columns m5">
                  <div className="value">
                    <span data-balloon="₹0.01" data-balloon-pos="up">
                      0.01
                    </span>
                  </div>
                  <div className="label">Margin available</div>
                </div>
                <div className="secondary-stats seven columns m7">
                  <div className="block">
                    <span className="label">Margins used</span>{" "}
                    <span className="value">
                      <span data-balloon="₹0.00" data-balloon-pos="up">
                        0
                      </span>
                    </span>
                  </div>
                  <div className="block">
                    <span className="label">Opening balance</span>{" "}
                    <span className="value">
                      <span data-balloon="₹0.01" data-balloon-pos="up">
                        0.01
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="stats-block holdings" style={{ display: "flex" }}>
          <div className="holdings-block portfolio-block">
            <div className="empty-state">
              {" "}
              <img
                src="https://kite.zerodha.com/static/images/illustrations/holdings.svg"
                alt="holdings-img"
                className="empty-img"
              />
              <div>
                <p>
                  You don't have any stocks in your DEMAT yet. Get started with
                  absolutely free equity investments.
                </p>
              </div>{" "}
              <button type="button" className="button-blue">
                Start investing
              </button>
              <div className="footer"></div>
            </div>
          </div>
          <div className="interactive-banner">
            <div
              className="promo-banner click"
              style={{
                backgroundImage:
                  "url(https://zerodha.com/z-connect/wp-content/uploads/2020/12/Kite-white.png)",
                borderColor: "transparent",
                borderStyle: "solid",
                borderWidth: "1",
              }}
            >
              <div
                className="banner-actions"
                style={{
                  inset: "auto 0px 33px 150px",
                  position: "absolute",
                  textAlign: "left",
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="stats-block row">
          <div className="six columns market-overview-block">
            <h2 className="secondary-title">
              <span className="icon icon-trending-up"></span>
              Market overview
            </h2>
            <div>
              <div className="chart">
                <svg width="301.91668701171875" height="180">
                  <g transform="translate(5,20)">
                    <path
                      className="line line1"
                      d="M0,110C4.122314070750835,105.7881542024385,8.24462814150167,101.57630840487701,11.320868748376904,98.51312743575468C14.39710935525214,95.44994646663235,16.42727649825178,93.53543032594915,19.40720356864612,93.3551147185513C22.387130639040464,93.17479911115346,26.316817636829498,94.72868403704102,29.110805352969184,95.10050692999678C31.90479306910887,95.47232982295255,33.56308150359919,94.6620906829766,36.38850669121148,96.11341459841182C39.21393187882377,97.56473851384705,43.20649381955801,101.27762548469349,46.09210847553454,97.94583467635597C48.97772313151106,94.61404386801846,50.75639050272988,84.23757528049701,53.36980981377683,81.82875728895009C55.98322912482379,79.41993929740316,59.43140037569884,84.97877190183071,62.26477811607297,85.30020218595246C65.0981558564471,85.6216324700742,67.31674008632024,80.70566043389015,69.54247945431527,77.37744308025906C71.7682188223103,74.04922572662797,74.00111332842722,72.30876305554985,76.82018079255757,72.50952325138454C79.6392482566879,72.71028344721923,83.04448867883167,74.85226650996673,85.71514909485371,72.50952325138454C88.38580951087576,70.16677999280235,90.3218899207762,63.33931041289052,92.99285043309601,62.709218507340225C95.66381094541582,62.07912660178993,99.06965156015492,67.64641237060117,101.88781873539214,67.92847305652415C104.70598591062937,68.21053374244714,106.93647964636466,63.20736934548186,109.16552007363443,61.211211064553C111.39456050090419,59.21505278362414,113.62214761970843,60.22590061873172,116.44322141187673,60.192662701087116C119.26429520404504,60.15942478344251,122.67885566957736,59.08210111304571,125.33818971417287,58.602792510329074C127.99752375876838,58.12348390761244,129.90163138242715,58.242190372576,132.61589105241515,58.94123421337944C135.33015072240315,59.64027805418288,138.85456243872036,60.9196592708262,141.5108593547113,62.14353737509891C144.16715627070224,63.367415479371616,145.95533838636692,64.53579047127371,148.7885606929536,62.1918861898204C151.6217829995403,59.84798190836708,155.50004549704894,53.991798353558295,158.49216247727668,51.17802619626687C161.4842794575044,48.364254038975446,163.59025092045113,48.592893279201384,165.76986381551896,51.070047176722255C167.9494767105868,53.54720107424313,170.20273103777572,58.272869629058896,173.04756515376124,55.82837635889472C175.89239926974676,53.38388308873055,179.32881317452896,43.76922799358641,181.94253345605742,39.89421865385179C184.55625373758588,36.01920931411716,186.3472803958605,37.883845729792,189.2202347942997,37.628270870571676C192.0931891927389,37.37269601135135,196.04807133134267,34.99690987723586,198.92383657862277,32.19144665514111C201.79960182590287,29.385983433046356,203.59625018185906,26.150843122972375,206.20153791686505,26.240513376505426C208.80682565187104,26.330183630038476,212.2207527659268,29.74466444717856,215.09650621916117,28.656342485422105C217.97225967239555,27.56802052366565,220.30983946480848,21.976895783012672,223.1828410394304,18.126776452662114C226.05584261405232,14.276657122311557,229.46426597088336,12.16754320226341,232.07780934172652,10.020291851027052C234.69135271256968,7.873040499790694,236.51001609742477,5.687651717366123,239.35551067996886,7.442494212793375C242.20100526251295,9.197336708220627,246.07333104274605,14.8924104814997,249.05911246429187,13.30075892987956C252.0448938858377,11.70910737825942,254.14413094869627,2.830730501740061,256.3368138025342,0C258.52949665637215,-2.830730501740061,260.8156253011894,0.3861853712991761,263.6145151407765,2.010504878834942C266.4134049803636,3.6348243863707084,269.72505601472056,3.666547528403005,272.5094834430726,3.0201892929352105C275.29391087142466,2.373831057467416,277.5511146937719,1.049391444499532,280.59581826334187,1.2175843174026313C283.6405218329118,1.3857771903057305,287.4727251497047,3.0466025490798128,289.49078656563796,4.7019222316640805C291.50884798157125,6.357241914248348,291.71276749664503,8.007055920642804,291.91668701171875,9.65686992703726"
                    ></path>
                    <g
                      className="axis-bottom"
                      transform="translate(0,120)"
                      fill="none"
                      fontSize="10"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      <path
                        className="domain"
                        stroke="#000"
                        d="M0.5,0V0.5H292.41668701171875V0"
                      ></path>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(2.1172669640538437,0)"
                      >
                        <line stroke="#000" y2="0"></line>
                        <text fill="#000" y="5" dy="0.71em">
                          Apr 20
                        </text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(75.70291382850371,0)"
                      >
                        <line stroke="#000" y2="0"></line>
                        <text fill="#000" y="5" dy="0.71em">
                          Jul 20
                        </text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(150.09719417498053,0)"
                      >
                        <line stroke="#000" y2="0"></line>
                        <text fill="#000" y="5" dy="0.71em">
                          Oct 20
                        </text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(224.49147452145732,0)"
                      >
                        <line stroke="#000" y2="0"></line>
                        <text fill="#000" y="5" dy="0.71em">
                          Jan 21
                        </text>
                      </g>
                    </g>
                    <g
                      className="axis-left"
                      fill="none"
                      fontSize="10"
                      fontFamily="sans-serif"
                      textAnchor="end"
                    >
                      <path
                        className="domain"
                        stroke="#000"
                        d="M291.91668701171875,110.5H0.5V0.5H291.91668701171875"
                      ></path>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,98.91401236557564)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,82.79774079174848)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,66.6814692179213)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,50.56519764409412)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,34.44892607026695)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,18.332654496439776)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                      <g
                        className="tick"
                        opacity="1"
                        transform="translate(0,2.2163829226125915)"
                      >
                        <line stroke="#000" x2="291.91668701171875"></line>
                        <text fill="#000" x="-3" dy="0.32em"></text>
                      </g>
                    </g>
                    <g className="focus">
                      <line
                        className="x-hover-line hover-line"
                        y1="0"
                        y2="110"
                      ></line>
                      <circle r="1"></circle>
                      <text className="nifty tooltip" x="0" dy="0.3em"></text>
                      <text className="sensex tooltip" x="0" dy="1.5em"></text>
                    </g>
                    <g className="legends">
                      <rect
                        className="legend-bar legend-1-bar"
                        width="9"
                        height="9"
                        x="10"
                        y="5"
                      ></rect>
                      <text
                        className="legend-label legend-1-label"
                        x="22"
                        y="12"
                      >
                        NIFTY 50
                      </text>
                    </g>
                  </g>
                  <rect
                    transform="translate(5,20)"
                    className="overlay"
                    width="291.91668701171875"
                    height="110"
                  ></rect>
                </svg>
              </div>
            </div>
          </div>
          <div className="six columns positions-block">
            <div className="empty-state">
              {" "}
              <img
                src="https://kite.zerodha.com/static/images/illustrations/positions.svg"
                alt="positions-svg"
                className="empty-img"
              />
              <div>
                <p>You don't have any positions yet</p>
              </div>{" "}
              <button type="button" className="button-blue">
                Get started
              </button>
              <div className="footer"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
