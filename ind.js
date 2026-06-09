< !DOCTYPE html >
    <html lang="en">
        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Globist Prototype</title>
                    <style>
                        :root {
                            --yellow: #F5A623;
                        --yellow-light: #FFF3DC;
                        --black: #111111;
                        --white: #FFFFFF;
                        --gray1: #F7F6F2;
                        --gray2: #EEEDE9;
                        --gray3: #C8C7C2;
                        --gray4: #888780;
                        --text1: #111111;
                        --text2: #444441;
                        --text3: #888780;
                        --green: #1D9E75;
                        --red: #E24B4A;
                        --blue: #185FA5;
                        --radius: 12px;
                        --phone-w: 375px;
                        --phone-h: 812px;
}
                        * {box - sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
                        body {
                            background: #1a1a1a;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        min-height: 100vh;
                        font-family: -apple-system, 'SF Pro Display', 'Segoe UI', Arial, sans-serif;
                        padding: 20px 0 40px;
}

                        /* SCREEN NAV */
                        .screen-nav {
                            display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
                        margin-bottom: 16px; max-width: 700px; padding: 0 12px;
}
                        .snav-btn {
                            padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
                        border: 1.5px solid #444; color: #aaa; background: #2a2a2a; cursor: pointer;
                        transition: all .2s;
}
                        .snav-btn.active {background: var(--yellow); color: #000; border-color: var(--yellow); }
                        .snav-btn:hover {border - color: var(--yellow); color: var(--yellow); }

                        /* PHONE SHELL */
                        .phone {
                            width: var(--phone-w);
                        height: var(--phone-h);
                        background: var(--white);
                        border-radius: 44px;
                        box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 10px #2a2a2a, 0 0 0 11px #3a3a3a;
                        overflow: hidden;
                        position: relative;
                        flex-shrink: 0;
}
                        .phone-inner {
                            width: 100%; height: 100%;
                        overflow: hidden; position: relative;
                        border-radius: 44px;
}

                        /* STATUS BAR */
                        .status-bar {
                            display: flex; justify-content: space-between; align-items: center;
                        padding: 14px 24px 6px;
                        position: sticky; top: 0; z-index: 100;
                        background: inherit;
}
                        .status-time {font - size: 15px; font-weight: 700; color: var(--text1); }
                        .status-icons {display: flex; align-items: center; gap: 5px; }
                        .status-icons svg {width: 16px; height: 12px; }

                        /* SCREEN */
                        .screen {
                            display: none;
                        flex-direction: column;
                        height: 100%;
                        background: var(--white);
                        overflow: hidden;
}
                        .screen.active {display: flex; }
                        .scroll-area {
                            flex: 1; overflow-y: auto; overflow-x: hidden;
                        scrollbar-width: none;
}
                        .scroll-area::-webkit-scrollbar {display: none; }

                        /* BOTTOM NAV */
                        .bottom-nav {
                            display: flex; justify-content: space-around; align-items: center;
                        padding: 10px 0 20px;
                        border-top: 1px solid var(--gray2);
                        background: var(--white);
                        flex-shrink: 0;
}
                        .bnav-item {
                            display: flex; flex-direction: column; align-items: center; gap: 3px;
                        cursor: pointer; padding: 4px 12px;
}
                        .bnav-item svg {width: 22px; height: 22px; }
                        .bnav-label {font - size: 10px; font-weight: 500; color: var(--gray4); }
                        .bnav-item.active .bnav-label {color: var(--yellow); }
                        .bnav-item.active svg path, .bnav-item.active svg rect {stroke: var(--yellow); }

                        /* TYPOGRAPHY */
                        .h1 {font - size: 26px; font-weight: 700; color: var(--text1); }
                        .h2 {font - size: 20px; font-weight: 700; color: var(--text1); }
                        .h3 {font - size: 16px; font-weight: 600; color: var(--text1); }
                        .body1 {font - size: 14px; color: var(--text2); line-height: 1.5; }
                        .body2 {font - size: 13px; color: var(--text3); line-height: 1.5; }
                        .caption {font - size: 11px; color: var(--text3); }

                        /* BUTTONS */
                        .btn-primary {
                            background: var(--yellow); color: var(--black);
                        border: none; border-radius: 12px; padding: 14px 24px;
                        font-size: 15px; font-weight: 700; cursor: pointer; width: 100%;
                        transition: opacity .2s;
}
                        .btn-primary:hover {opacity: .9; }
                        .btn-outline {
                            background: transparent; color: var(--text1);
                        border: 1.5px solid var(--gray2); border-radius: 12px; padding: 13px 24px;
                        font-size: 15px; font-weight: 600; cursor: pointer; width: 100%;
}
                        .btn-sm {
                            background: var(--yellow); color: var(--black);
                        border: none; border-radius: 8px; padding: 8px 16px;
                        font-size: 13px; font-weight: 700; cursor: pointer;
}
                        .btn-sm-outline {
                            background: transparent; color: var(--text1);
                        border: 1.5px solid var(--gray2); border-radius: 8px; padding: 7px 14px;
                        font-size: 13px; font-weight: 600; cursor: pointer;
}

                        /* TAGS / PILLS */
                        .pill {
                            display: inline-flex; align-items: center;
                        padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
                        border: 1.5px solid var(--gray2); color: var(--text2);
                        cursor: pointer; white-space: nowrap;
}
                        .pill.active {background: var(--yellow); color: var(--black); border-color: var(--yellow); }
                        .pill-green {background: #E1F5EE; color: #0F6E56; border-color: #5DCAA5; }
                        .pill-amber {background: var(--yellow-light); color: var(--yellow); border-color: var(--yellow); }
                        .pill-gray  {background: var(--gray1); color: var(--text3); border-color: var(--gray2); }

                        /* CARDS */
                        .card {
                            background: var(--white); border: 1px solid var(--gray2);
                        border-radius: var(--radius); overflow: hidden;
}
                        .card-shadow {box - shadow: 0 2px 12px rgba(0,0,0,.06); }

                        /* VERIFIED BADGE */
                        .verified {display: inline-flex; align-items: center; gap: 3px; color: var(--blue); font-size: 11px; font-weight: 600; }

                        /* STAR */
                        .star-row {display: flex; align-items: center; gap: 3px; }
                        .star {color: var(--yellow); font-size: 12px; }
                        .star-val {font - size: 12px; font-weight: 600; color: var(--text1); }
                        .star-count {font - size: 11px; color: var(--text3); }

                        /* INPUT */
                        .input-wrap {position: relative; }
                        .input {
                            width: 100%; padding: 13px 16px; border: 1.5px solid var(--gray2);
                        border-radius: 10px; font-size: 14px; color: var(--text1);
                        background: var(--gray1); outline: none;
                        font-family: inherit;
}
                        .input:focus {border - color: var(--yellow); background: var(--white); }
                        .input-label {font - size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 5px; }

                        /* IMAGE PLACEHOLDERS */
                        .img-placeholder {
                            background: linear-gradient(135deg, #2a4a3a 0%, #1a3a2a 50%, #0a2a1a 100%);
                        position: relative; overflow: hidden;
}
                        .img-placeholder::after {
                            content: ''; position: absolute; inset: 0;
                        background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,.5) 100%);
}
                        .img-mountain {background: linear-gradient(135deg, #4a7a9b 0%, #2c5f7a 40%, #1a3a5a 100%); }
                        .img-valley   {background: linear-gradient(135deg, #3a7a4a 0%, #2a5a3a 50%, #1a4a2a 100%); }
                        .img-desert   {background: linear-gradient(135deg, #c9a96e 0%, #a07840 50%, #7a5a20 100%); }
                        .img-snow     {background: linear-gradient(135deg, #8ab4cc 0%, #6090b0 40%, #2a5a7a 100%); }
                        .img-jungle   {background: linear-gradient(135deg, #2d7a3a 0%, #1d5a2a 50%, #0d3a1a 100%); }
                        .img-beach    {background: linear-gradient(135deg, #4ab8c8 0%, #2a90a8 40%, #1a7090 100%); }
                        .img-luxury   {background: linear-gradient(135deg, #8a6a3a 0%, #6a4a20 50%, #4a2a10 100%); }
                        .img-dark     {background: linear-gradient(135deg, #1a2a3a 0%, #0a1a2a 100%); }

                        /* ============================================
                           SCREEN 1 — SPLASH / ONBOARDING
                           ============================================ */
                        #screen-splash .splash-bg {
                            flex: 1; position: relative; overflow: hidden;
                        background: linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 40%, #0a2a1a 100%);
                        display: flex; flex-direction: column; justify-content: flex-end;
                        padding: 32px 28px;
}
                        #screen-splash .splash-bg::before {
                            content: ''; position: absolute; inset: 0;
                        background: radial-gradient(ellipse at 60% 30%, rgba(245,166,35,.15) 0%, transparent 60%);
}
                        .splash-mountain {
                            position: absolute; bottom: 35%; left: 0; right: 0;
                        height: 200px; z-index: 0;
                        background: linear-gradient(180deg, transparent, #1a3a1a 80%);
}
                        .splash-mountain::before {
                            content: ''; position: absolute;
                        border-left: 90px solid transparent; border-right: 90px solid transparent;
                        border-bottom: 140px solid #2a5a2a; bottom: 0; left: 30px;
}
                        .splash-mountain::after {
                            content: ''; position: absolute;
                        border-left: 120px solid transparent; border-right: 120px solid transparent;
                        border-bottom: 180px solid #1a4a1a; bottom: 0; left: 100px;
}
                        .splash-content {position: relative; z-index: 2; }
                        .splash-logo {display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
                        .splash-logo-icon {
                            width: 44px; height: 44px; background: var(--yellow); border-radius: 12px;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 22px;
}
                        .splash-logo-text {font - size: 30px; font-weight: 800; color: var(--white); }
                        .splash-tagline {font - size: 15px; color: rgba(255,255,255,.7); margin-bottom: 32px; line-height: 1.5; }
                        .splash-dots {display: flex; gap: 6px; justify-content: center; margin-bottom: 24px; }
                        .splash-dot {width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.3); }
                        .splash-dot.active {width: 20px; border-radius: 3px; background: var(--yellow); }

                        /* ============================================
                           SCREEN 2 — SIGN UP
                           ============================================ */
                        #screen-signup {
                            background: var(--white);
}
                        .signup-top {
                            padding: 60px 28px 24px;
                        background: linear-gradient(180deg, var(--black) 0%, var(--black) 60%, var(--white) 100%);
}
                        .signup-logo {display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
                        .signup-logo-icon {
                            width: 36px; height: 36px; background: var(--yellow); border-radius: 10px;
                        display: flex; align-items: center; justify-content: center; font-size: 18px;
}
                        .signup-logo-text {font - size: 22px; font-weight: 800; color: var(--white); }
                        .signup-form {padding: 28px; }
                        .role-selector {display: flex; gap: 10px; margin-bottom: 20px; }
                        .role-card {
                            flex: 1; border: 2px solid var(--gray2); border-radius: 12px;
                        padding: 14px 10px; text-align: center; cursor: pointer; transition: all .2s;
}
                        .role-card.selected {border - color: var(--yellow); background: var(--yellow-light); }
                        .role-card .role-icon {font - size: 24px; margin-bottom: 5px; }
                        .role-card .role-name {font - size: 13px; font-weight: 600; color: var(--text1); }
                        .role-card .role-desc {font - size: 10px; color: var(--text3); margin-top: 2px; }
                        .divider-or {display: flex; align-items: center; gap: 12px; margin: 16px 0; }
                        .divider-or span {font - size: 12px; color: var(--text3); }
                        .divider-or::before, .divider-or::after {content: ''; flex: 1; height: 1px; background: var(--gray2); }

                        /* ============================================
                           SCREEN 3 — HOME FEED
                           ============================================ */
                        .home-topbar {
                            display: flex; justify-content: space-between; align-items: center;
                        padding: 8px 20px 12px;
}
                        .home-logo {display: flex; align-items: center; gap: 6px; }
                        .home-logo-icon {
                            width: 28px; height: 28px; background: var(--black); border-radius: 7px;
                        display: flex; align-items: center; justify-content: center; font-size: 14px;
}
                        .home-logo-text {font - size: 18px; font-weight: 800; color: var(--text1); }
                        .topbar-icons {display: flex; gap: 12px; align-items: center; }
                        .topbar-icon {width: 36px; height: 36px; border-radius: 50%; background: var(--gray1); display: flex; align-items: center; justify-content: center; cursor: pointer; }
                        .avatar-sm {width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#4a7a4a,#2a5a2a); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 700; position: relative; }
                        .online-dot {width: 8px; height: 8px; border-radius: 50%; background: var(--green); border: 2px solid white; position: absolute; bottom: 0; right: 0; }

                        .search-bar {
                            display: flex; align-items: center; gap: 10px;
                        background: var(--gray1); border-radius: 12px; padding: 10px 14px;
                        margin: 0 20px 14px;
}
                        .search-bar input {flex: 1; border: none; background: transparent; font-size: 14px; color: var(--text2); outline: none; font-family: inherit; }
                        .search-bar input::placeholder {color: var(--text3); }

                        .section-header {display: flex; justify-content: space-between; align-items: center; padding: 0 20px; margin-bottom: 12px; }
                        .view-all {font - size: 12px; font-weight: 600; color: var(--yellow); cursor: pointer; display: flex; align-items: center; gap: 2px; }

                        /* Featured card */
                        .featured-card {
                            margin: 0 20px 20px;
                        border-radius: 16px; overflow: hidden;
                        height: 180px; position: relative; cursor: pointer;
}
                        .featured-card .img-mountain {height: 100%; }
                        .featured-overlay {
                            position: absolute; inset: 0;
                        background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,.7) 100%);
                        display: flex; flex-direction: column; justify-content: flex-end; padding: 16px;
                        z-index: 1;
}
                        .featured-badge {
                            display: inline-flex; align-items: center; gap: 4px;
                        background: rgba(255,255,255,.2); backdrop-filter: blur(8px);
                        border: 1px solid rgba(255,255,255,.3);
                        padding: 3px 10px; border-radius: 20px;
                        font-size: 10px; font-weight: 600; color: white; margin-bottom: 6px;
                        width: fit-content;
}
                        .featured-title {font - size: 20px; font-weight: 800; color: white; }
                        .featured-sub {font - size: 12px; color: rgba(255,255,255,.7); }
                        .featured-action {
                            position: absolute; top: 12px; right: 12px; z-index: 2;
                        width: 36px; height: 36px; border-radius: 50%;
                        background: rgba(255,255,255,.2); backdrop-filter: blur(8px);
                        border: 1px solid rgba(255,255,255,.3);
                        display: flex; align-items: center; justify-content: center;
}

                        /* Scroll row */
                        .hscroll {display: flex; gap: 12px; overflow-x: auto; padding: 0 20px 4px; scrollbar-width: none; }
                        .hscroll::-webkit-scrollbar {display: none; }

                        /* Topic card */
                        .topic-card {
                            flex - shrink: 0; width: 120px; border-radius: 12px; overflow: hidden;
                        height: 80px; position: relative; cursor: pointer;
}
                        .topic-overlay {position: absolute; inset: 0; background: rgba(0,0,0,.4); display: flex; flex-direction: column; justify-content: flex-end; padding: 8px; }
                        .topic-name {font - size: 12px; font-weight: 700; color: white; }
                        .topic-count {font - size: 10px; color: rgba(255,255,255,.7); }

                        /* Trip card */
                        .trip-card {
                            flex - shrink: 0; width: 160px; border-radius: 14px;
                        overflow: hidden; cursor: pointer; border: 1px solid var(--gray2);
}
                        .trip-card-img {height: 110px; position: relative; }
                        .trip-card-body {padding: 10px; }
                        .trip-name {font - size: 13px; font-weight: 600; color: var(--text1); margin-bottom: 2px; }
                        .trip-loc {font - size: 11px; color: var(--text3); display: flex; align-items: center; gap: 2px; }
                        .trip-price {font - size: 13px; font-weight: 700; color: var(--text1); margin-top: 4px; }

                        /* Trending row */
                        .trending-item {
                            display: flex; align-items: center; gap: 12px;
                        padding: 12px 20px; cursor: pointer;
                        border-bottom: 1px solid var(--gray1);
}
                        .trending-icon {width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
                        .trending-info {flex: 1; }
                        .trending-name {font - size: 14px; font-weight: 600; color: var(--text1); }
                        .trending-count {font - size: 12px; color: var(--text3); }

                        /* ============================================
                           SCREEN 4 — REELS
                           ============================================ */
                        #screen-reels {
                            background: #000;
}
                        #screen-reels .status-bar {background: transparent; position: absolute; top: 0; left: 0; right: 0; z-index: 10; }
                        #screen-reels .status-bar .status-time {color: white; }
                        .reel-container {flex: 1; position: relative; overflow: hidden; cursor: pointer; }
                        .reel-bg {
                            position: absolute; inset: 0;
                        background: linear-gradient(160deg, #0a1a3a 0%, #1a3a5a 40%, #2a5a4a 100%);
}
                        .reel-bg::after {content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.2) 0%, transparent 30%, transparent 50%, rgba(0,0,0,.8) 100%); }
                        .reel-side-actions {
                            position: absolute; right: 14px; bottom: 120px; z-index: 5;
                        display: flex; flex-direction: column; align-items: center; gap: 20px;
}
                        .reel-action {display: flex; flex-direction: column; align-items: center; gap: 4px; }
                        .reel-action-btn {
                            width: 44px; height: 44px; border-radius: 50%;
                        background: rgba(255,255,255,.15); backdrop-filter: blur(8px);
                        display: flex; align-items: center; justify-content: center; cursor: pointer;
}
                        .reel-action-label {font - size: 11px; color: white; font-weight: 500; }
                        .reel-creator-thumb {
                            width: 44px; height: 44px; border-radius: 50%;
                        background: linear-gradient(135deg,#4a7a9b,#2a5a7a);
                        border: 2px solid white; margin-bottom: 4px;
                        display: flex; align-items: center; justify-content: center;
                        color: white; font-size: 16px; font-weight: 700;
}
                        .reel-bottom {
                            position: absolute; bottom: 80px; left: 16px; right: 70px; z-index: 5;
}
                        .reel-creator-name {font - size: 15px; font-weight: 700; color: white; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                        .reel-follow-btn {font - size: 11px; font-weight: 600; color: var(--yellow); background: rgba(245,166,35,.2); border: 1px solid var(--yellow); border-radius: 12px; padding: 2px 10px; }
                        .reel-caption {font - size: 13px; color: rgba(255,255,255,.9); line-height: 1.5; margin-bottom: 8px; }
                        .reel-tags {display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
                        .reel-tag {font - size: 12px; color: var(--yellow); font-weight: 500; }
                        .reel-meta {display: flex; align-items: center; gap: 12px; }
                        .reel-location {font - size: 12px; color: rgba(255,255,255,.7); display: flex; align-items: center; gap: 4px; }
                        .reel-music {font - size: 12px; color: rgba(255,255,255,.7); display: flex; align-items: center; gap: 4px; }

                        /* BOOK NOW STRIP */
                        .book-strip {
                            position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
                        background: rgba(0,0,0,.6); backdrop-filter: blur(16px);
                        padding: 10px 16px 20px;
}
                        .book-strip-inner {display: flex; align-items: center; gap: 10px; }
                        .book-strip-img {width: 44px; height: 44px; border-radius: 10px; background: var(--img-mountain); flex-shrink: 0; }
                        .book-strip-info {flex: 1; }
                        .book-strip-name {font - size: 13px; font-weight: 600; color: white; }
                        .book-strip-price {font - size: 12px; color: rgba(255,255,255,.7); }
                        .book-strip-btn {background: var(--yellow); color: var(--black); border: none; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 700; cursor: pointer; flex-shrink: 0; }

                        /* Progress dots */
                        .reel-progress {display: flex; gap: 3px; padding: 10px 16px 0; position: absolute; top: 44px; left: 0; right: 0; z-index: 5; }
                        .reel-prog-bar {flex: 1; height: 2px; background: rgba(255,255,255,.3); border-radius: 1px; overflow: hidden; }
                        .reel-prog-fill {height: 100%; background: white; border-radius: 1px; }

                        /* ============================================
                           SCREEN 5 — EXPLORE
                           ============================================ */
                        .explore-header {
                            padding: 8px 20px 0;
}
                        .explore-title {display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }

                        /* ============================================
                           SCREEN 6 — REGION (Himachal)
                           ============================================ */
                        .region-hero {height: 200px; position: relative; }
                        .region-hero-overlay {
                            position: absolute; inset: 0;
                        background: linear-gradient(180deg, rgba(0,0,0,.2) 0%, rgba(0,0,0,.7) 100%);
                        display: flex; flex-direction: column; justify-content: flex-end; padding: 16px;
}
                        .back-btn {width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,.2); backdrop-filter: blur(8px); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; position: absolute; top: 52px; left: 16px; z-index: 5; }

                        .agency-card {
                            background: var(--white); border: 1px solid var(--gray2);
                        border-radius: 14px; overflow: hidden; margin: 0 20px 14px; cursor: pointer;
}
                        .agency-img {height: 150px; position: relative; }
                        .agency-tag {
                            position: absolute; bottom: 10px; right: 10px;
                        background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
                        color: white; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
}
                        .agency-loc-tag {
                            position: absolute; bottom: 10px; left: 10px;
                        background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
                        color: white; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px;
                        display: flex; align-items: center; gap: 3px;
}
                        .agency-body {padding: 14px; }
                        .agency-name {font - size: 16px; font-weight: 700; color: var(--text1); margin-bottom: 4px; }
                        .agency-desc {font - size: 12px; color: var(--text3); line-height: 1.5; margin-bottom: 10px; }
                        .agency-footer {display: flex; justify-content: space-between; align-items: center; }
                        .agency-price {font - size: 12px; color: var(--text3); }
                        .agency-price strong {font - size: 16px; color: var(--text1); font-weight: 700; }

                        /* ============================================
                           SCREEN 7 — TRIP DETAIL
                           ============================================ */
                        .trip-hero {height: 240px; position: relative; flex-shrink: 0; }
                        .trip-hero-overlay {
                            position: absolute; inset: 0;
                        background: linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 40%, rgba(0,0,0,.7) 100%);
}
                        .trip-hero-bottom {position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; }
                        .price-badge {background: var(--yellow); color: var(--black); font-size: 16px; font-weight: 800; padding: 6px 14px; border-radius: 20px; }
                        .info-grid {display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 16px 20px; }
                        .info-item {background: var(--gray1); border-radius: 10px; padding: 12px; }
                        .info-item-label {font - size: 10px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 3px; }
                        .info-item-val {font - size: 14px; font-weight: 700; color: var(--text1); }
                        .creator-strip {
                            display: flex; align-items: center; gap: 12px;
                        margin: 0 20px 16px; padding: 12px 14px;
                        background: var(--yellow-light); border-radius: 12px;
                        border: 1px solid rgba(245,166,35,.3);
}
                        .creator-strip-avatar {width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg,#4a7a4a,#2a5a2a); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 700; flex-shrink: 0; }
                        .creator-strip-info {flex: 1; }
                        .creator-strip-name {font - size: 13px; font-weight: 600; color: var(--text1); }
                        .creator-strip-label {font - size: 11px; color: var(--text3); }
                        .explorer-badge {display: inline-flex; align-items: center; gap: 4px; background: var(--yellow); color: var(--black); font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
                        .itinerary-item {display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--gray1); }
                        .itin-day {width: 32px; height: 32px; border-radius: 50%; background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
                        .itin-info .itin-title {font - size: 13px; font-weight: 600; color: var(--text1); }
                        .itin-info .itin-desc {font - size: 12px; color: var(--text3); line-height: 1.4; margin-top: 2px; }

                        /* ============================================
                           SCREEN 8 — BOOKING FLOW
                           ============================================ */
                        .booking-step {padding: 20px; }
                        .booking-progress {display: flex; gap: 6px; margin-bottom: 24px; }
                        .bp-step {flex: 1; height: 3px; border-radius: 2px; background: var(--gray2); }
                        .bp-step.done {background: var(--yellow); }
                        .bp-step.active {background: var(--black); }
                        .date-grid {display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; margin-bottom: 20px; }
                        .date-cell {aspect - ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }
                        .date-cell:hover {background: var(--yellow-light); }
                        .date-cell.selected {background: var(--yellow); font-weight: 700; }
                        .date-cell.disabled {color: var(--gray3); cursor: default; }
                        .date-cell.range {background: var(--yellow-light); }
                        .traveler-row {display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--gray1); }
                        .traveler-row:last-child {border - bottom: none; }
                        .counter {display: flex; align-items: center; gap: 14px; }
                        .counter-btn {width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--gray2); background: transparent; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text1); }
                        .counter-btn.active {border - color: var(--yellow); background: var(--yellow); }
                        .counter-val {font - size: 16px; font-weight: 700; color: var(--text1); min-width: 24px; text-align: center; }
                        .booking-summary {background: var(--gray1); border-radius: 14px; padding: 16px; margin-bottom: 20px; }
                        .summary-row {display: flex; justify-content: space-between; padding: 6px 0; }
                        .summary-row.total {border - top: 1px solid var(--gray2); margin-top: 6px; padding-top: 12px; }
                        .summary-label {font - size: 13px; color: var(--text3); }
                        .summary-val {font - size: 13px; font-weight: 600; color: var(--text1); }
                        .summary-row.total .summary-label {font - size: 15px; font-weight: 700; color: var(--text1); }
                        .summary-row.total .summary-val {font - size: 16px; font-weight: 800; color: var(--text1); }
                        .payment-method {display: flex; align-items: center; gap: 12px; padding: 14px; border: 2px solid var(--gray2); border-radius: 12px; margin-bottom: 10px; cursor: pointer; }
                        .payment-method.selected {border - color: var(--yellow); background: var(--yellow-light); }
                        .pm-icon {width: 40px; height: 28px; border-radius: 6px; background: var(--gray2); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
                        .pm-name {font - size: 14px; font-weight: 600; color: var(--text1); }
                        .pm-desc {font - size: 11px; color: var(--text3); }
                        .radio {width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--gray2); margin-left: auto; flex-shrink: 0; }
                        .radio.selected {border - color: var(--yellow); background: var(--yellow); }

                        /* SUCCESS */
                        .success-screen {display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 28px; flex: 1; }
                        .success-icon {width: 80px; height: 80px; border-radius: 50%; background: var(--green); display: flex; align-items: center; justify-content: center; font-size: 36px; margin-bottom: 20px; }
                        .confetti {font - size: 32px; position: absolute; }

                        /* ============================================
                           SCREEN 9 — PROFILE
                           ============================================ */
                        .profile-hero {
                            padding: 20px 20px 0; background: var(--white);
                        display: flex; flex-direction: column; align-items: center;
}
                        .profile-avatar-wrap {position: relative; margin-bottom: 12px; }
                        .profile-avatar {width: 84px; height: 84px; border-radius: 50%; background: linear-gradient(135deg,#4a7a4a,#2a5a2a); display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 700; border: 3px solid var(--yellow); }
                        .profile-camera {position: absolute; bottom: 0; right: 0; width: 26px; height: 26px; background: var(--yellow); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; }
                        .profile-name {font - size: 20px; font-weight: 700; color: var(--text1); display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
                        .profile-loc {font - size: 13px; color: var(--text3); display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
                        .profile-bio {font - size: 13px; color: var(--text2); text-align: center; line-height: 1.5; margin-bottom: 14px; max-width: 280px; }
                        .stats-row {display: flex; gap: 1px; background: var(--gray2); border-radius: 14px; overflow: hidden; margin: 0 20px 16px; }
                        .stat-item {flex: 1; background: var(--gray1); padding: 14px 8px; text-align: center; }
                        .stat-val {font - size: 20px; font-weight: 800; color: var(--text1); }
                        .stat-label {font - size: 10px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }

                        /* Wallet card */
                        .wallet-card {
                            margin: 0 20px 16px; padding: 16px;
                        background: linear-gradient(135deg, var(--black) 0%, #2a2a2a 100%);
                        border-radius: 16px;
}
                        .wallet-top {display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
                        .wallet-label {font - size: 11px; color: rgba(255,255,255,.6); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
                        .wallet-points {font - size: 32px; font-weight: 800; color: white; }
                        .wallet-sub {font - size: 12px; color: rgba(255,255,255,.5); }
                        .wallet-badge-wrap {display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                        .wallet-badge {background: var(--yellow); color: var(--black); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
                        .wallet-progress {background: rgba(255,255,255,.15); border-radius: 4px; height: 4px; margin-bottom: 6px; overflow: hidden; }
                        .wallet-progress-fill {height: 100%; background: var(--yellow); border-radius: 4px; }
                        .wallet-progress-label {font - size: 10px; color: rgba(255,255,255,.5); }
                        .wallet-actions {display: flex; gap: 8px; }
                        .wallet-action-btn {flex: 1; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 8px; padding: 8px; text-align: center; font-size: 12px; font-weight: 600; color: white; cursor: pointer; }

                        /* Tabs */
                        .tab-row {display: flex; padding: 0 20px; border-bottom: 1px solid var(--gray2); margin-bottom: 0; }
                        .tab {flex: 1; padding: 12px 0; text-align: center; font-size: 13px; font-weight: 600; color: var(--text3); cursor: pointer; border-bottom: 2px solid transparent; }
                        .tab.active {color: var(--text1); border-bottom-color: var(--yellow); }

                        /* Journey card small */
                        .journey-card-sm {display: flex; gap: 12px; padding: 12px 20px; cursor: pointer; border-bottom: 1px solid var(--gray1); align-items: center; }
                        .journey-card-sm-img {width: 60px; height: 60px; border-radius: 10px; flex-shrink: 0; }
                        .journey-card-sm-info {flex: 1; }
                        .journey-card-sm-name {font - size: 14px; font-weight: 600; color: var(--text1); margin-bottom: 2px; }
                        .journey-card-sm-sub {font - size: 12px; color: var(--text3); }
                        .journey-status {font - size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 10px; }
                        .status-upcoming {background: var(--yellow-light); color: var(--yellow); }
                        .status-confirmed {background: #E1F5EE; color: var(--green); }

                        /* ============================================
                           SCREEN 10 — MY TRIPS
                           ============================================ */
                        .active-trip-card {
                            margin: 0 20px 20px; border-radius: 16px; overflow: hidden; position: relative; height: 180px; cursor: pointer;
}
                        .active-trip-overlay {
                            position: absolute; inset: 0; background: linear-gradient(180deg,transparent 20%,rgba(0,0,0,.8) 100%);
                        display: flex; flex-direction: column; justify-content: flex-end; padding: 16px;
}
                        .confirmed-badge {position: absolute; top: 12px; right: 12px; background: var(--green); color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }
                        .wishlist-item {display: flex; gap: 12px; padding: 12px 20px; align-items: center; border-bottom: 1px solid var(--gray1); cursor: pointer; }
                        .wishlist-img {width: 66px; height: 56px; border-radius: 10px; flex-shrink: 0; position: relative; }
                        .heart-btn {position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; background: rgba(255,255,255,.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; }
                        .wishlist-info {flex: 1; }
                        .wishlist-name {font - size: 14px; font-weight: 600; color: var(--text1); }
                        .wishlist-loc {font - size: 12px; color: var(--text3); display: flex; align-items: center; gap: 3px; margin: 2px 0; }
                        .wishlist-price {font - size: 13px; font-weight: 700; color: var(--text1); }
                        .book-now-link {font - size: 12px; font-weight: 700; color: var(--blue); }

                        /* ============================================
                           SCREEN 11 — MENU
                           ============================================ */
                        .menu-user {display: flex; gap: 14px; align-items: center; padding: 20px; background: var(--gray1); margin-bottom: 8px; }
                        .menu-avatar {width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg,#4a7a4a,#2a5a2a); display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; position: relative; }
                        .menu-user-info .menu-name {font - size: 16px; font-weight: 700; color: var(--text1); }
                        .menu-user-info .menu-level {font - size: 12px; color: var(--text3); }
                        .menu-tags {display: flex; gap: 6px; margin-top: 5px; }
                        .menu-tag {font - size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; }
                        .mt-yellow {background: var(--yellow-light); color: #854F0B; }
                        .mt-green  {background: #E1F5EE; color: #0F6E56; }
                        .menu-item {display: flex; align-items: center; gap: 14px; padding: 15px 20px; border-bottom: 1px solid var(--gray1); cursor: pointer; }
                        .menu-item-icon {width: 36px; height: 36px; border-radius: 10px; background: var(--gray1); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
                        .menu-item-name {flex: 1; font-size: 15px; font-weight: 500; color: var(--text1); }
                        .menu-badge {background: var(--red); color: white; font-size: 10px; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                        .menu-arrow {font - size: 16px; color: var(--gray3); }
                        .menu-section-label {font - size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: .08em; padding: 12px 20px 4px; }
                        .logout-item {color: var(--red) !important; }

                        /* ============================================
                           SCREEN 12 — POST REEL
                           ============================================ */
                        .post-upload-area {
                            margin: 0 20px 20px; height: 200px; border: 2px dashed var(--gray2);
                        border-radius: 16px; display: flex; flex-direction: column; align-items: center;
                        justify-content: center; gap: 8px; cursor: pointer; background: var(--gray1);
}
                        .post-upload-area:hover {border - color: var(--yellow); background: var(--yellow-light); }
                        .upload-icon {font - size: 36px; }
                        .upload-text {font - size: 14px; font-weight: 600; color: var(--text2); }
                        .upload-sub {font - size: 12px; color: var(--text3); }
                        .affiliate-toggle {display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--yellow-light); border-radius: 12px; border: 1px solid rgba(245,166,35,.3); margin: 0 20px 14px; }
                        .toggle-switch {width: 42px; height: 24px; border-radius: 12px; background: var(--yellow); position: relative; cursor: pointer; }
                        .toggle-knob {width: 20px; height: 20px; border-radius: 50%; background: white; position: absolute; top: 2px; right: 2px; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
                        .earn-preview {margin: 0 20px 20px; padding: 14px; background: #E1F5EE; border-radius: 12px; border: 1px solid #5DCAA5; display: flex; align-items: center; gap: 12px; }
                        .earn-preview-icon {font - size: 28px; }
                        .earn-preview-info .earn-title {font - size: 13px; font-weight: 700; color: #0F6E56; }
                        .earn-preview-info .earn-desc {font - size: 12px; color: #1D9E75; }

                        /* ============================================
                           SCREEN 13 — BOOKING CONFIRMATION
                           ============================================ */

                        /* UTILS */
                        .px-20 {padding - left: 20px; padding-right: 20px; }
                        .py-12 {padding - top: 12px; padding-bottom: 12px; }
                        .mb-8  {margin - bottom: 8px; }
                        .mb-12 {margin - bottom: 12px; }
                        .mb-16 {margin - bottom: 16px; }
                        .mb-20 {margin - bottom: 20px; }
                        .mt-8  {margin - top: 8px; }
                        .mt-12 {margin - top: 12px; }
                        .flex  {display: flex; }
                        .flex-center {display: flex; align-items: center; }
                        .flex-between {display: flex; justify-content: space-between; align-items: center; }
                        .gap-8  {gap: 8px; }
                        .gap-12 {gap: 12px; }
                        .text-center {text - align: center; }
                        .w-full {width: 100%; }
                        .sticky-bottom {position: sticky; bottom: 0; background: white; padding: 12px 20px 20px; border-top: 1px solid var(--gray1); }
                    </style>
                </head>
                <body>

                    <!-- SCREEN NAVIGATION -->
                    <div class="screen-nav">
                        <button class="snav-btn active" onclick="showScreen('splash')">1. Splash</button>
                        <button class="snav-btn" onclick="showScreen('signup')">2. Sign Up</button>
                        <button class="snav-btn" onclick="showScreen('home')">3. Home</button>
                        <button class="snav-btn" onclick="showScreen('reels')">4. Reels</button>
                        <button class="snav-btn" onclick="showScreen('explore')">5. Explore</button>
                        <button class="snav-btn" onclick="showScreen('region')">6. Region</button>
                        <button class="snav-btn" onclick="showScreen('tripdetail')">7. Trip Detail</button>
                        <button class="snav-btn" onclick="showScreen('booking')">8. Booking</button>
                        <button class="snav-btn" onclick="showScreen('postreal')">9. Post Reel</button>
                        <button class="snav-btn" onclick="showScreen('profile')">10. Profile</button>
                        <button class="snav-btn" onclick="showScreen('mytrips')">11. My Trips</button>
                        <button class="snav-btn" onclick="showScreen('menu')">12. Menu</button>
                    </div>

                    <div class="phone">
                        <div class="phone-inner">

                            <!-- ============ SCREEN 1: SPLASH ============ -->
                            <div class="screen active" id="screen-splash">
                                <div class="status-bar" style="background:transparent;position:absolute;top:0;left:0;right:0;z-index:10">
                                    <div style="width: 40px"></div>
                                    
                                </div>
                                <div class="splash-bg">
                                    <div class="splash-mountain"></div>
                                    <div class="splash-content">
                                        <div class="splash-logo">
                                            <div class="splash-logo-icon">⚡</div>
                                            <div class="splash-logo-text">Globist</div>
                                        </div>
                                        <div class="splash-tagline">Discover. Travel. Share.<br>Earn rewards for every trip you inspire.</div>
                                        <div class="splash-dots">
                                            <div class="splash-dot active"></div>
                                            <div class="splash-dot"></div>
                                            <div class="splash-dot"></div>
                                        </div>
                                        <button class="btn-primary mb-8" onclick="showScreen('signup')">Get Started</button>
                                        <button class="btn-outline" style="color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.1)">I already have an account</button>
                                    </div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 2: SIGNUP ============ -->
                            <div class="screen" id="screen-signup" style="background:var(--white)">
                                <div class="signup-top">
                                    <div class="signup-logo">
                                        <div class="signup-logo-icon">⚡</div>
                                        <div class="signup-logo-text">Globist</div>
                                    </div>
                                    <div class="h2" style="color:white;margin-bottom:4px">Join Globist</div>
                                    <div class="body2" style="color:rgba(255,255,255,.6)">Travel, share, and earn referral points</div>
                                </div>
                                <div class="signup-form scroll-area">
                                    <div class="body1 mb-12" style="font-weight:600">I want to...</div>
                                    <div class="role-selector mb-20">
                                        <div class="role-card selected">
                                            <div class="role-icon">🧳</div>
                                            <div class="role-name">Traveler</div>
                                            <div class="role-desc">Discover & book trips</div>
                                        </div>
                                        <div class="role-card">
                                            <div class="role-icon">🎬</div>
                                            <div class="role-name">Creator</div>
                                            <div class="role-desc">Post reels & earn</div>
                                        </div>
                                        <div class="role-card">
                                            <div class="role-icon">🏔️</div>
                                            <div class="role-name">Agency</div>
                                            <div class="role-desc">List my packages</div>
                                        </div>
                                    </div>
                                    <div class="mb-12">
                                        <div class="input-label">Full Name</div>
                                        <input class="input" placeholder="Arjun Sharma" value="Arjun Sharma">
                                    </div>
                                    <div class="mb-12">
                                        <div class="input-label">Mobile Number</div>
                                        <div class="input-wrap">
                                            <input class="input" placeholder="+91 98765 43210" value="+91 98765 43210" style="padding-left:16px">
                                        </div>
                                    </div>
                                    <div class="mb-12">
                                        <div class="input-label">Interests</div>
                                        <div style="display:flex;flex-wrap:wrap;gap:7px">
                                            <div class="pill active">🏔️ Trekking</div>
                                            <div class="pill active">🏕️ Camping</div>
                                            <div class="pill">🏖️ Beach</div>
                                            <div class="pill">🏛️ Culture</div>
                                            <div class="pill">🍽️ Food</div>
                                            <div class="pill active">❄️ Snow</div>
                                            <div class="pill">🧘 Wellness</div>
                                            <div class="pill">🚵 Adventure</div>
                                        </div>
                                    </div>
                                    <div class="divider-or"><span>or continue with</span></div>
                                    <div style="display:flex;gap:10px;margin-bottom:20px">
                                        <button class="btn-outline" style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px"><span style="font-size:16px">G</span> Google</button>
                                        <button class="btn-outline" style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px"><span style="font-size:16px">f</span> Facebook</button>
                                    </div>
                                    <button class="btn-primary" onclick="showScreen('home')">Send OTP →</button>
                                    <div style="text-align:center;margin-top:12px;font-size:11px;color:var(--text3)">By continuing you agree to our Terms & Privacy Policy</div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 3: HOME ============ -->
                            <div class="screen" id="screen-home">
                                <div class="status-bar"><div style="width: 40px"></div></div>
                                <div class="home-topbar">
                                    <div class="home-logo">
                                        <div class="home-logo-icon">⚡</div>
                                        <div class="home-logo-text">Globist</div>
                                    </div>
                                    <div style="display:flex;gap:10px;align-items:center">
                                        <div class="topbar-icon">🔔</div>
                                        <div class="avatar-sm">A<div class="online-dot"></div></div>
                                    </div>
                                </div>
                                <div class="scroll-area">
                                    <div class="search-bar">
                                        <span>🔍</span>
                                        <input placeholder="Search destinations, agencies...">
                                            <span style="font-size:18px;cursor:pointer">⊞</span>
                                    </div>

                                    <!-- Featured -->
                                    <div class="section-header">
                                        <div class="h3">Featured Regions</div>
                                        <div class="view-all">View All ✦</div>
                                    </div>
                                    <div class="featured-card" onclick="showScreen('region')">
                                        <div class="img-mountain" style="height:100%"></div>
                                        <div class="featured-overlay">
                                            <div class="featured-badge">✦ FEATURED · 42+ Spots</div>
                                            <div class="featured-title">Himachal Pradesh</div>
                                            <div class="featured-sub">Manali · Kasol · Shimla · Spiti</div>
                                        </div>
                                        <div class="featured-action">⊙</div>
                                    </div>

                                    <!-- Trending Reels -->
                                    <div class="section-header">
                                        <div class="h3">🔥 Trending Reels</div>
                                        <div class="view-all" onclick="showScreen('reels')">See All</div>
                                    </div>
                                    <div class="hscroll mb-20">
                                        <div style="flex-shrink:0;width:140px;border-radius:14px;overflow:hidden;height:200px;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                            <div class="img-mountain" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85) 100%);padding:10px;display:flex;flex-direction:column;justify-content:flex-end">
                                                <div style="font-size:10px;color:white;font-weight:600">@mountain_explorer</div>
                                                <div style="font-size:11px;color:rgba(255,255,255,.8);margin-top:2px">Manali Snow Trek</div>
                                                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
                                                    <div style="font-size:10px;color:rgba(255,255,255,.7)">❤️ 12.4K</div>
                                                    <div style="background:var(--yellow);color:black;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px">Book</div>
                                                </div>
                                            </div>
                                            <div style="position:absolute;top:8px;left:8px;background:var(--yellow);border-radius:20px;padding:2px 7px;font-size:9px;font-weight:700">🥇 Gold</div>
                                        </div>
                                        <div style="flex-shrink:0;width:140px;border-radius:14px;overflow:hidden;height:200px;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                            <div class="img-valley" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85) 100%);padding:10px;display:flex;flex-direction:column;justify-content:flex-end">
                                                <div style="font-size:10px;color:white;font-weight:600">@rishikesh_vibes</div>
                                                <div style="font-size:11px;color:rgba(255,255,255,.8);margin-top:2px">Ganges Rafting</div>
                                                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
                                                    <div style="font-size:10px;color:rgba(255,255,255,.7)">❤️ 8.2K</div>
                                                    <div style="background:var(--yellow);color:black;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px">Book</div>
                                                </div>
                                            </div>
                                            <div style="position:absolute;top:8px;left:8px;background:#C0C0C0;border-radius:20px;padding:2px 7px;font-size:9px;font-weight:700;color:#333">🥈 Silver</div>
                                        </div>
                                        <div style="flex-shrink:0;width:140px;border-radius:14px;overflow:hidden;height:200px;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                            <div class="img-snow" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.85) 100%);padding:10px;display:flex;flex-direction:column;justify-content:flex-end">
                                                <div style="font-size:10px;color:white;font-weight:600">@auli_diaries</div>
                                                <div style="font-size:11px;color:rgba(255,255,255,.8);margin-top:2px">Auli Skiing</div>
                                                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px">
                                                    <div style="font-size:10px;color:rgba(255,255,255,.7)">❤️ 6.1K</div>
                                                    <div style="background:var(--yellow);color:black;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px">Book</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Trending Topics -->
                                    <div class="section-header"><div class="h3">⭐ Trending Topics</div></div>
                                    <div class="trending-item" onclick="showScreen('explore')">
                                        <div class="trending-icon" style="background:#E6F1FB">📍</div>
                                        <div class="trending-info"><div class="trending-name">Local Hidden Gems</div><div class="trending-count">2.1M active explorers</div></div>
                                        <span style="color:var(--gray3)">›</span>
                                    </div>
                                    <div class="trending-item" onclick="showScreen('explore')">
                                        <div class="trending-icon" style="background:#FEF0F0">🏛️</div>
                                        <div class="trending-info"><div class="trending-name">Historic Expeditions</div><div class="trending-count">1.5M active explorers</div></div>
                                        <span style="color:var(--gray3)">›</span>
                                    </div>
                                    <div class="trending-item" onclick="showScreen('explore')">
                                        <div class="trending-icon" style="background:var(--yellow-light)">⭐</div>
                                        <div class="trending-info"><div class="trending-name">Luxury Stays</div><div class="trending-count">750K active explorers</div></div>
                                        <span style="color:var(--gray3)">›</span>
                                    </div>
                                    <div class="trending-item" onclick="showScreen('explore')">
                                        <div class="trending-icon" style="background:#EEEDFE">🥾</div>
                                        <div class="trending-info"><div class="trending-name">LTreks</div><div class="trending-count">750K active explorers</div></div>
                                        <span style="color:var(--gray3)">›</span>
                                    </div>

                                    <!-- Nearby agencies -->
                                    <div class="section-header mt-8"><div class="h3">🏔️ Popular Agencies</div><div class="view-all">View All</div></div>
                                    <div class="hscroll mb-20">
                                        <div class="trip-card" onclick="showScreen('tripdetail')">
                                            <div class="trip-card-img img-mountain"></div>
                                            <div class="trip-card-body">
                                                <div class="trip-name">Himalayan High Treks</div>
                                                <div class="trip-loc">📍 Himachal Pradesh</div>
                                                <div class="star-row mt-8"><span class="star">★</span><span class="star-val">4.9</span><span class="star-count">(1,240)</span></div>
                                                <div class="trip-price">₹12,500</div>
                                            </div>
                                        </div>
                                        <div class="trip-card" onclick="showScreen('tripdetail')">
                                            <div class="trip-card-img img-valley"></div>
                                            <div class="trip-card-body">
                                                <div class="trip-name">Ganges Valley Treks</div>
                                                <div class="trip-loc">📍 Uttarakhand</div>
                                                <div class="star-row mt-8"><span class="star">★</span><span class="star-val">4.8</span><span class="star-count">(856)</span></div>
                                                <div class="trip-price">₹8,000</div>
                                            </div>
                                        </div>
                                        <div class="trip-card" onclick="showScreen('tripdetail')">
                                            <div class="trip-card-img img-snow"></div>
                                            <div class="trip-card-body">
                                                <div class="trip-name">Auli Snow Escapes</div>
                                                <div class="trip-loc">📍 Uttarakhand</div>
                                                <div class="star-row mt-8"><span class="star">★</span><span class="star-val">4.7</span><span class="star-count">(623)</span></div>
                                                <div class="trip-price">₹18,000</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height:20px"></div>
                                </div>
                                <!-- BOTTOM NAV -->
                                <div class="bottom-nav">
                                    <div class="bnav-item active" onclick="showScreen('home')"><span style="font-size:22px">🏠</span><div class="bnav-label" style="color:var(--yellow)">Home</div></div>
                                    <div class="bnav-item" onclick="showScreen('reels')"><span style="font-size:22px">🎬</span><div class="bnav-label">Reels</div></div>
                                    <div class="bnav-item" onclick="showScreen('explore')"><span style="font-size:22px">🧭</span><div class="bnav-label">Explore</div></div>
                                    <div class="bnav-item" onclick="showScreen('mytrips')"><span style="font-size:22px">🗺️</span><div class="bnav-label">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 4: REELS ============ -->
                            <div class="screen" id="screen-reels" style="background:#000;position:relative">
                                <div class="status-bar" style="background:transparent;position:absolute;top:0;left:0;right:0;z-index:20;padding-top:14px">
                                    <div style="width: 40px"></div>
                                    <div style="font-size:15px;font-weight:700;color:white">Reels</div>
                                    <div style="font-size:13px;color:white">🔍</div>
                                </div>
                                <!-- Reel progress bars -->
                                <div class="reel-progress" style="top:48px">
                                    <div class="reel-prog-bar"><div class="reel-prog-fill" style="width:100%"></div></div>
                                    <div class="reel-prog-bar"><div class="reel-prog-fill" style="width:40%"></div></div>
                                    <div class="reel-prog-bar"><div class="reel-prog-fill" style="width:0%"></div></div>
                                </div>
                                <div class="reel-container">
                                    <div class="reel-bg"></div>
                                    <!-- Mountain scene -->
                                    <div style="position:absolute;inset:0;z-index:1;overflow:hidden">
                                        <div style="position:absolute;bottom:35%;left:0;right:0;height:300px;background:linear-gradient(180deg,transparent,rgba(10,30,58,.8) 100%)"></div>
                                        <div style="position:absolute;bottom:30%;left:-20%;width:60%;height:0;border-left:120px solid transparent;border-right:120px solid transparent;border-bottom:200px solid rgba(30,60,90,.8)"></div>
                                        <div style="position:absolute;bottom:30%;right:-10%;width:60%;height:0;border-left:100px solid transparent;border-right:100px solid transparent;border-bottom:160px solid rgba(20,50,80,.9)"></div>
                                    </div>
                                    <!-- Side actions -->
                                    <div class="reel-side-actions">
                                        <div class="reel-creator-thumb">M</div>
                                        <div class="reel-action">
                                            <div class="reel-action-btn">❤️</div>
                                            <div class="reel-action-label">12.4K</div>
                                        </div>
                                        <div class="reel-action">
                                            <div class="reel-action-btn">💬</div>
                                            <div class="reel-action-label">842</div>
                                        </div>
                                        <div class="reel-action">
                                            <div class="reel-action-btn">↗️</div>
                                            <div class="reel-action-label">2.1K</div>
                                        </div>
                                        <div class="reel-action">
                                            <div class="reel-action-btn">🔖</div>
                                            <div class="reel-action-label">Save</div>
                                        </div>
                                        <div class="reel-action">
                                            <div class="reel-action-btn" style="font-size:12px">🎵</div>
                                        </div>
                                    </div>
                                    <!-- Bottom info -->
                                    <div class="reel-bottom">
                                        <div class="reel-creator-name">
                                            @mountain_explorer
                                            <span class="reel-follow-btn">Follow</span>
                                            <span class="explorer-badge">🥇 Gold</span>
                                        </div>
                                        <div class="reel-caption">Waking up to the serene peaks of Manali. The air is different up here. ⛰️</div>
                                        <div class="reel-tags">
                                            <span class="reel-tag">#Himachal</span>
                                            <span class="reel-tag">#RoamFlow</span>
                                            <span class="reel-tag">#Manali</span>
                                        </div>
                                        <div class="reel-meta">
                                            <div class="reel-location">📍 Manali, Himachal Pradesh</div>
                                            <div class="reel-music">🎵 Local Folk - Mountain Spirit</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Book now strip -->
                                <div class="book-strip">
                                    <div class="book-strip-inner">
                                        <div class="book-strip-img img-mountain"></div>
                                        <div class="book-strip-info">
                                            <div class="book-strip-name">Himalayan High Treks</div>
                                            <div class="book-strip-price">Starts ₹12,500 · ⭐ 4.9</div>
                                        </div>
                                        <button class="book-strip-btn" onclick="showScreen('tripdetail')">Book Now →</button>
                                    </div>
                                </div>
                                <!-- Bottom nav reels -->
                                <div class="bottom-nav" style="background:transparent;border-top:none;position:absolute;bottom:0;left:0;right:0;z-index:15;padding-bottom:10px">
                                    <div class="bnav-item" onclick="showScreen('home')"><span style="font-size:22px;filter:brightness(10)">🏠</span><div class="bnav-label" style="color:rgba(255,255,255,.7)">Home</div></div>
                                    <div class="bnav-item"><span style="font-size:22px">🎬</span><div class="bnav-label" style="color:var(--yellow)">Reels</div></div>
                                    <div class="bnav-item" onclick="showScreen('explore')"><span style="font-size:22px;filter:brightness(10)">🧭</span><div class="bnav-label" style="color:rgba(255,255,255,.7)">Explore</div></div>
                                    <div class="bnav-item" onclick="showScreen('mytrips')"><span style="font-size:22px;filter:brightness(10)">🗺️</span><div class="bnav-label" style="color:rgba(255,255,255,.7)">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 5: EXPLORE ============ -->
                            <div class="screen" id="screen-explore">
                                <div class="status-bar"><div style="width: 40px"></div><div style="display:flex;gap:10px"><span>🔍</span><span>🔔</span></div></div>
                                <div class="scroll-area">
                                    <div class="px-20 mb-12">
                                        <div class="h2 mb-8">Explore</div>
                                        <div class="search-bar" style="margin:0 0 12px">
                                            <span>🔍</span><input placeholder="Destinations, treks, stays...">
                                        </div>
                                        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none">
                                            <div class="pill active">All</div>
                                            <div class="pill">Treks</div>
                                            <div class="pill">Luxury Stays</div>
                                            <div class="pill">City Tours</div>
                                            <div class="pill">Adventure</div>
                                            <div class="pill">Spiritual</div>
                                        </div>
                                    </div>
                                    <!-- Luxury stays banner -->
                                    <div style="margin:0 20px 20px;border-radius:16px;overflow:hidden;height:130px;position:relative;cursor:pointer" onclick="showScreen('region')">
                                        <div class="img-luxury" style="height:100%"></div>
                                        <div style="position:absolute;inset:0;background:rgba(0,0,0,.5);padding:16px;display:flex;flex-direction:column;justify-content:flex-end">
                                            <div style="background:var(--yellow);color:black;font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;width:fit-content;margin-bottom:6px">Trending Topic</div>
                                            <div style="font-size:20px;font-weight:800;color:white">Hidden Luxury</div>
                                            <div style="font-size:11px;color:rgba(255,255,255,.8)">Escape the ordinary in India's most exclusive retreats</div>
                                        </div>
                                    </div>

                                    <!-- Regions grid -->
                                    <div class="section-header"><div class="h3">Featured Regions</div><div class="view-all">View All</div></div>
                                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px;margin-bottom:20px">
                                        <div style="border-radius:14px;overflow:hidden;height:110px;position:relative;cursor:pointer" onclick="showScreen('region')">
                                            <div class="img-mountain" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;flex-direction:column;justify-content:flex-end;padding:10px">
                                                <div style="font-size:14px;font-weight:700;color:white">Himachal Pradesh</div>
                                                <div style="font-size:10px;color:rgba(255,255,255,.7)">42+ Spots</div>
                                            </div>
                                        </div>
                                        <div style="border-radius:14px;overflow:hidden;height:110px;position:relative;cursor:pointer" onclick="showScreen('region')">
                                            <div class="img-valley" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;flex-direction:column;justify-content:flex-end;padding:10px">
                                                <div style="font-size:14px;font-weight:700;color:white">Uttarakhand</div>
                                                <div style="font-size:10px;color:rgba(255,255,255,.7)">35+ Spots</div>
                                            </div>
                                        </div>
                                        <div style="border-radius:14px;overflow:hidden;height:110px;position:relative;cursor:pointer">
                                            <div class="img-desert" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;flex-direction:column;justify-content:flex-end;padding:10px">
                                                <div style="font-size:14px;font-weight:700;color:white">Rajasthan</div>
                                                <div style="font-size:10px;color:rgba(255,255,255,.7)">28+ Spots</div>
                                            </div>
                                        </div>
                                        <div style="border-radius:14px;overflow:hidden;height:110px;position:relative;cursor:pointer">
                                            <div class="img-beach" style="height:100%"></div>
                                            <div style="position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;flex-direction:column;justify-content:flex-end;padding:10px">
                                                <div style="font-size:14px;font-weight:700;color:white">Kerala</div>
                                                <div style="font-size:10px;color:rgba(255,255,255,.7)">30+ Spots</div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Top agencies -->
                                    <div class="section-header"><div class="h3">🏆 Top Rated Agencies</div></div>
                                    <div class="trending-item" onclick="showScreen('tripdetail')">
                                        <div class="trending-icon img-mountain" style="width:46px;height:46px;border-radius:10px;flex-shrink:0"></div>
                                        <div class="trending-info">
                                            <div class="trending-name">Himalayan High Treks <span style="color:var(--blue);font-size:10px">✓ Verified</span></div>
                                            <div class="trending-count">⭐ 4.9 · 1,240 reviews · Himachal Pradesh</div>
                                        </div>
                                        <div style="font-size:12px;font-weight:700;color:var(--text1)">₹12,500</div>
                                    </div>
                                    <div class="trending-item" onclick="showScreen('tripdetail')">
                                        <div class="trending-icon img-valley" style="width:46px;height:46px;border-radius:10px;flex-shrink:0"></div>
                                        <div class="trending-info">
                                            <div class="trending-name">Ganges Valley Treks <span style="color:var(--blue);font-size:10px">✓ Verified</span></div>
                                            <div class="trending-count">⭐ 4.8 · 856 reviews · Uttarakhand</div>
                                        </div>
                                        <div style="font-size:12px;font-weight:700;color:var(--text1)">₹8,000</div>
                                    </div>
                                    <div class="trending-item" onclick="showScreen('tripdetail')">
                                        <div class="trending-icon img-snow" style="width:46px;height:46px;border-radius:10px;flex-shrink:0"></div>
                                        <div class="trending-info">
                                            <div class="trending-name">Auli Snow Escapes</div>
                                            <div class="trending-count">⭐ 4.7 · 623 reviews · Uttarakhand</div>
                                        </div>
                                        <div style="font-size:12px;font-weight:700;color:var(--text1)">₹18,000</div>
                                    </div>
                                    <div style="height:20px"></div>
                                </div>
                                <div class="bottom-nav">
                                    <div class="bnav-item" onclick="showScreen('home')"><span style="font-size:22px">🏠</span><div class="bnav-label">Home</div></div>
                                    <div class="bnav-item" onclick="showScreen('reels')"><span style="font-size:22px">🎬</span><div class="bnav-label">Reels</div></div>
                                    <div class="bnav-item active"><span style="font-size:22px">🧭</span><div class="bnav-label" style="color:var(--yellow)">Explore</div></div>
                                    <div class="bnav-item" onclick="showScreen('mytrips')"><span style="font-size:22px">🗺️</span><div class="bnav-label">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 6: REGION ============ -->
                            <div class="screen" id="screen-region">
                                <div class="status-bar" style="position:absolute;top:0;left:0;right:0;z-index:10;background:transparent">
                                    <div style="width: 40px"></div>
                                    <div style="display:flex;gap:10px"><span style="color:white">🔍</span><span style="color:white">⊞</span></div>
                                </div>
                                <button class="back-btn" onclick="showScreen('explore')">‹</button>
                                <div class="region-hero img-mountain" style="flex-shrink:0">
                                    <div class="region-hero-overlay">
                                        <div style="font-size:28px;font-weight:800;color:white">Himachal Pradesh</div>
                                        <div style="font-size:13px;color:rgba(255,255,255,.8)">42+ Spots · 12 Verified Agencies</div>
                                    </div>
                                </div>
                                <div style="display:flex;gap:8px;overflow-x:auto;padding:12px 20px;scrollbar-width:none;flex-shrink:0;border-bottom:1px solid var(--gray2)">
                                    <div class="pill active">All</div>
                                    <div class="pill">Treks</div>
                                    <div class="pill">Luxury Stays</div>
                                    <div class="pill">City Tours</div>
                                    <div class="pill">Adventure</div>
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 20px;flex-shrink:0">
                                    <div style="font-size:13px;font-weight:600;color:var(--text2)">↕ Sort: Popularity</div>
                                    <div style="font-size:13px;font-weight:600;color:var(--yellow);display:flex;align-items:center;gap:4px">📍 Map View</div>
                                </div>
                                <div class="scroll-area">
                                    <div class="agency-card" onclick="showScreen('tripdetail')">
                                        <div class="agency-img img-mountain">
                                            <div style="position:absolute;top:10px;left:10px;background:var(--blue);color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;display:flex;align-items:center;gap:4px">✓ Verified</div>
                                            <div class="agency-tag">Adventure & Treks</div>
                                            <div class="agency-loc-tag">📍 Manali</div>
                                        </div>
                                        <div class="agency-body">
                                            <div class="flex-between mb-8">
                                                <div class="agency-name">Himalayan High Treks</div>
                                                <div class="star-row"><span class="star">★</span><span class="star-val">4.9</span><span class="star-count">(1,240)</span></div>
                                            </div>
                                            <div class="agency-desc">Expert-led expeditions to Spiti and Pin Valley. Specializing in high-altitude survival and local culture experiences.</div>
                                            <div style="display:flex;gap:6px;margin-bottom:10px"><span class="pill-gray pill" style="font-size:10px">ADVENTURE</span><span class="pill-gray pill" style="font-size:10px">TREKS</span></div>
                                            <div class="agency-footer">
                                                <div class="agency-price">Starts at <strong>₹12,500</strong></div>
                                                <button class="btn-sm" onclick="showScreen('tripdetail')">View Plans →</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="agency-card" onclick="showScreen('tripdetail')">
                                        <div class="agency-img img-valley">
                                            <div style="position:absolute;top:10px;left:10px;background:var(--blue);color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px">✓ Verified</div>
                                            <div class="agency-tag">Luxury Stays & Family</div>
                                            <div class="agency-loc-tag">📍 Old Manali</div>
                                        </div>
                                        <div class="agency-body">
                                            <div class="flex-between mb-8">
                                                <div class="agency-name">Manali Luxury Escapes</div>
                                                <div class="star-row"><span class="star">★</span><span class="star-val">4.7</span><span class="star-count">(850)</span></div>
                                            </div>
                                            <div class="agency-desc">Bespoke riverside villas and wellness retreats in the heart of Old Manali. Premium transport included.</div>
                                            <div style="display:flex;gap:6px;margin-bottom:10px"><span class="pill-gray pill" style="font-size:10px">LUXURY</span><span class="pill-gray pill" style="font-size:10px">FAMILY</span></div>
                                            <div class="agency-footer">
                                                <div class="agency-price">Starts at <strong>₹25,000</strong></div>
                                                <button class="btn-sm" onclick="showScreen('tripdetail')">View Plans →</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="agency-card">
                                        <div class="agency-img img-snow">
                                            <div class="agency-tag">City Tours & Culture</div>
                                            <div class="agency-loc-tag">📍 Shimla</div>
                                        </div>
                                        <div class="agency-body">
                                            <div class="flex-between mb-8">
                                                <div class="agency-name">Shimla Heritage Walks</div>
                                                <div class="star-row"><span class="star">★</span><span class="star-val">4.8</span><span class="star-count">(620)</span></div>
                                            </div>
                                            <div class="agency-desc">Deep dive into colonial history. Authentic local food and hidden trail experiences.</div>
                                            <div style="display:flex;gap:6px;margin-bottom:10px"><span class="pill-gray pill" style="font-size:10px">CITY TOURS</span><span class="pill-gray pill" style="font-size:10px">CULTURE</span></div>
                                            <div class="agency-footer">
                                                <div class="agency-price">Starts at <strong>₹4,500</strong></div>
                                                <button class="btn-sm">View Plans →</button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Custom plan CTA -->
                                    <div style="margin:4px 20px 20px;padding:16px;background:var(--gray1);border-radius:14px;text-align:center">
                                        <div style="font-size:22px;margin-bottom:6px">🕐</div>
                                        <div style="font-size:14px;font-weight:600;color:var(--text1);margin-bottom:3px">Need a custom plan?</div>
                                        <div style="font-size:12px;color:var(--text3);margin-bottom:12px">Get a quote within 24 hours.</div>
                                        <button class="btn-primary" style="background:var(--blue);color:white">Chat with Experts</button>
                                    </div>
                                </div>
                                <div class="bottom-nav">
                                    <div class="bnav-item" onclick="showScreen('home')"><span style="font-size:22px">🏠</span><div class="bnav-label">Home</div></div>
                                    <div class="bnav-item" onclick="showScreen('reels')"><span style="font-size:22px">🎬</span><div class="bnav-label">Reels</div></div>
                                    <div class="bnav-item active" onclick="showScreen('explore')"><span style="font-size:22px">🧭</span><div class="bnav-label" style="color:var(--yellow)">Explore</div></div>
                                    <div class="bnav-item" onclick="showScreen('mytrips')"><span style="font-size:22px">🗺️</span><div class="bnav-label">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 7: TRIP DETAIL ============ -->
                            <div class="screen" id="screen-tripdetail">
                                <div style="position:absolute;top:0;left:0;right:0;z-index:10;display:flex;justify-content:space-between;padding:14px 16px">
                                    <button class="back-btn" style="position:static" onclick="showScreen('region')">‹</button>
                                    <div style="display:flex;gap:8px">
                                        <button style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:none;font-size:16px;cursor:pointer">♡</button>
                                        <button style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:none;font-size:16px;cursor:pointer">↗</button>
                                    </div>
                                </div>
                                <div class="trip-hero img-mountain" style="flex-shrink:0">
                                    <div class="trip-hero-overlay"></div>
                                    <div class="trip-hero-bottom">
                                        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                                            <span style="background:var(--blue);color:white;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px">✓ Verified</span>
                                            <span class="pill-amber pill" style="font-size:10px">⭐ 4.9 · 1,240 reviews</span>
                                        </div>
                                        <div style="font-size:22px;font-weight:800;color:white;margin-bottom:4px">Himalayan High Treks</div>
                                        <div style="font-size:13px;color:rgba(255,255,255,.8);display:flex;align-items:center;gap:4px">📍 Manali, Himachal Pradesh</div>
                                    </div>
                                </div>

                                <div class="scroll-area">
                                    <!-- Price row -->
                                    <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--gray1)">
                                        <div>
                                            <div style="font-size:11px;color:var(--text3)">Starts from</div>
                                            <div style="font-size:24px;font-weight:800;color:var(--text1)">₹12,500 <span style="font-size:12px;font-weight:400;color:var(--text3)">/person</span></div>
                                        </div>
                                        <div style="display:flex;align-items:center;gap:4px;font-size:12px;color:var(--text3)">👥 34 active now</div>
                                    </div>

                                    <!-- Info grid -->
                                    <div class="info-grid">
                                        <div class="info-item"><div class="info-item-label">Duration</div><div class="info-item-val">6 Days</div></div>
                                        <div class="info-item"><div class="info-item-label">Group Size</div><div class="info-item-val">2–15 people</div></div>
                                        <div class="info-item"><div class="info-item-label">Difficulty</div><div class="info-item-val">Moderate</div></div>
                                        <div class="info-item"><div class="info-item-label">Next Slot</div><div class="info-item-val">Dec 12</div></div>
                                    </div>

                                    <!-- Creator strip -->
                                    <div class="creator-strip">
                                        <div class="creator-avatar" style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4a7a4a,#2a5a2a);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:700;flex-shrink:0">A</div>
                                        <div style="flex:1">
                                            <div style="font-size:13px;font-weight:600;color:var(--text1)">Referred by @arjun.treks</div>
                                            <div style="font-size:11px;color:var(--text3)">Gold Explorer · 38 bookings inspired</div>
                                        </div>
                                        <div class="explorer-badge">🥇 Gold</div>
                                    </div>

                                    <!-- About -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-8">About this trip</div>
                                        <div class="body2">Expert-led expeditions to Spiti and Pin Valley. Specializing in high-altitude survival techniques and immersive local culture experiences with certified guides.</div>
                                    </div>

                                    <!-- Itinerary -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-12">Itinerary</div>
                                        <div class="itinerary-item">
                                            <div class="itin-day">D1</div>
                                            <div class="itin-info"><div class="itin-title">Arrival · Manali</div><div class="itin-desc">Pick-up from bus stand. Check-in, orientation and acclimatization walk.</div></div>
                                        </div>
                                        <div class="itinerary-item">
                                            <div class="itin-day">D2</div>
                                            <div class="itin-info"><div class="itin-title">Solang Valley Trek</div><div class="itin-desc">10km trek through alpine meadows. Camping overnight.</div></div>
                                        </div>
                                        <div class="itinerary-item">
                                            <div class="itin-day">D3</div>
                                            <div class="itin-info"><div class="itin-title">Beas Kund Summit</div><div class="itin-desc">High altitude trek to glacial lake at 3,700m elevation.</div></div>
                                        </div>
                                        <div class="itinerary-item" style="border-bottom:none">
                                            <div class="itin-day" style="background:var(--gray1)">+3</div>
                                            <div class="itin-info"><div class="itin-title" style="color:var(--yellow)">View full itinerary →</div></div>
                                        </div>
                                    </div>

                                    <!-- Reels from this agency -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-12">Reels from travelers ✨</div>
                                        <div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none">
                                            <div style="flex-shrink:0;width:90px;height:130px;border-radius:10px;overflow:hidden;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                                <div class="img-mountain" style="height:100%"></div>
                                                <div style="position:absolute;bottom:4px;left:4px;font-size:9px;color:white;font-weight:600">@mountain_explorer</div>
                                                <div style="position:absolute;top:4px;left:4px;background:var(--yellow);font-size:8px;font-weight:700;padding:1px 5px;border-radius:6px">🥇</div>
                                            </div>
                                            <div style="flex-shrink:0;width:90px;height:130px;border-radius:10px;overflow:hidden;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                                <div class="img-snow" style="height:100%"></div>
                                                <div style="position:absolute;bottom:4px;left:4px;font-size:9px;color:white;font-weight:600">@snowhiker</div>
                                            </div>
                                            <div style="flex-shrink:0;width:90px;height:130px;border-radius:10px;overflow:hidden;position:relative;cursor:pointer" onclick="showScreen('reels')">
                                                <div class="img-valley" style="height:100%"></div>
                                                <div style="position:absolute;bottom:4px;left:4px;font-size:9px;color:white;font-weight:600">@treklife</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="height:80px"></div>
                                </div>

                                <div class="sticky-bottom">
                                    <button class="btn-primary" onclick="showScreen('booking')">Book This Trip →</button>
                                </div>
                            </div>

                            <!-- ============ SCREEN 8: BOOKING FLOW ============ -->
                            <div class="screen" id="screen-booking">
                                <div class="status-bar"><div style="width: 40px"></div><div style="display:flex;gap:10px"><button onclick="showScreen('tripdetail')" style="background:none;border:none;font-size:20px;cursor:pointer">✕</button></div></div>
                                <div class="scroll-area">
                                    <div style="padding:4px 20px 16px">
                                        <div class="h3 mb-4">Book Your Trip</div>
                                        <div class="body2">Himalayan High Treks · Manali</div>
                                    </div>
                                    <div style="padding:0 20px;margin-bottom:4px">
                                        <div class="booking-progress">
                                            <div class="bp-step done"></div>
                                            <div class="bp-step active"></div>
                                            <div class="bp-step"></div>
                                            <div class="bp-step"></div>
                                        </div>
                                        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:20px">
                                            <span style="color:var(--green);font-weight:600">Dates</span><span style="color:var(--text1);font-weight:600">Travelers</span><span>Payment</span><span>Confirm</span>
                                        </div>
                                    </div>

                                    <!-- Calendar -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-4">Select Dates</div>
                                        <div class="body2 mb-12">December 2024</div>
                                        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:6px">
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Sun</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Mon</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Tue</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Wed</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Thu</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Fri</div>
                                            <div style="text-align:center;font-size:10px;font-weight:600;color:var(--text3);padding:4px 0">Sat</div>
                                        </div>
                                        <div class="date-grid">
                                            <div class="date-cell disabled">1</div><div class="date-cell disabled">2</div><div class="date-cell disabled">3</div><div class="date-cell disabled">4</div><div class="date-cell disabled">5</div><div class="date-cell disabled">6</div><div class="date-cell disabled">7</div>
                                            <div class="date-cell disabled">8</div><div class="date-cell disabled">9</div><div class="date-cell disabled">10</div><div class="date-cell disabled">11</div>
                                            <div class="date-cell selected">12</div><div class="date-cell range">13</div><div class="date-cell range">14</div>
                                            <div class="date-cell range">15</div><div class="date-cell range">16</div><div class="date-cell range">17</div><div class="date-cell selected" style="background:#1a1a1a;color:white">18</div>
                                            <div class="date-cell">19</div><div class="date-cell">20</div><div class="date-cell">21</div><div class="date-cell">22</div><div class="date-cell">23</div><div class="date-cell">24</div><div class="date-cell">25</div>
                                            <div class="date-cell">26</div><div class="date-cell">27</div><div class="date-cell">28</div><div class="date-cell">29</div><div class="date-cell">30</div><div class="date-cell">31</div>
                                        </div>
                                        <div style="background:var(--yellow-light);border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;margin-top:10px">
                                            <div><div style="font-size:10px;color:var(--text3)">CHECK-IN</div><div style="font-size:14px;font-weight:700;color:var(--text1)">Dec 12</div></div>
                                            <div style="color:var(--gray3)">→</div>
                                            <div><div style="font-size:10px;color:var(--text3)">CHECK-OUT</div><div style="font-size:14px;font-weight:700;color:var(--text1)">Dec 18</div></div>
                                            <div><div style="font-size:10px;color:var(--text3)">DURATION</div><div style="font-size:14px;font-weight:700;color:var(--text1)">6 Days</div></div>
                                        </div>
                                    </div>

                                    <!-- Travelers -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-12">Travelers</div>
                                        <div class="traveler-row">
                                            <div>
                                                <div style="font-size:14px;font-weight:600;color:var(--text1)">Adults</div>
                                                <div style="font-size:12px;color:var(--text3)">Age 18+</div>
                                            </div>
                                            <div class="counter">
                                                <button class="counter-btn">−</button>
                                                <span class="counter-val">2</span>
                                                <button class="counter-btn active">+</button>
                                            </div>
                                        </div>
                                        <div class="traveler-row" style="border-bottom:none">
                                            <div>
                                                <div style="font-size:14px;font-weight:600;color:var(--text1)">Children</div>
                                                <div style="font-size:12px;color:var(--text3)">Age 5–17</div>
                                            </div>
                                            <div class="counter">
                                                <button class="counter-btn">−</button>
                                                <span class="counter-val">0</span>
                                                <button class="counter-btn active">+</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Summary -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-12">Price Summary</div>
                                        <div class="booking-summary">
                                            <div class="summary-row"><span class="summary-label">₹12,500 × 2 adults</span><span class="summary-val">₹25,000</span></div>
                                            <div class="summary-row"><span class="summary-label">Platform fee</span><span class="summary-val">₹500</span></div>
                                            <div class="summary-row"><span class="summary-label" style="color:var(--green)">🎉 First booking discount</span><span class="summary-val" style="color:var(--green)">−₹1,200</span></div>
                                            <div class="summary-row total"><span class="summary-label">Total</span><span class="summary-val">₹24,300</span></div>
                                        </div>
                                    </div>

                                    <!-- Payment -->
                                    <div style="padding:0 20px 16px">
                                        <div class="h3 mb-12">Payment Method</div>
                                        <div class="payment-method selected">
                                            <div class="pm-icon">📱</div>
                                            <div><div class="pm-name">UPI</div><div class="pm-desc">GPay, PhonePe, Paytm</div></div>
                                            <div class="radio selected"></div>
                                        </div>
                                        <div class="payment-method">
                                            <div class="pm-icon">💳</div>
                                            <div><div class="pm-name">Credit / Debit Card</div><div class="pm-desc">Visa, Mastercard, RuPay</div></div>
                                            <div class="radio"></div>
                                        </div>
                                        <div class="payment-method">
                                            <div class="pm-icon">🏦</div>
                                            <div><div class="pm-name">Net Banking</div><div class="pm-desc">All major banks</div></div>
                                            <div class="radio"></div>
                                        </div>
                                        <div style="background:var(--yellow-light);border-radius:10px;padding:10px 12px;display:flex;gap:8px;align-items:center;margin-top:8px">
                                            <span>🎯</span>
                                            <div style="font-size:12px;color:#854F0B">You have <strong>250 referral points</strong> — save ₹250 on this booking</div>
                                            <button style="font-size:11px;font-weight:700;color:var(--yellow);background:none;border:none;cursor:pointer;white-space:nowrap">Apply</button>
                                        </div>
                                    </div>
                                    <div style="height:80px"></div>
                                </div>
                                <div class="sticky-bottom">
                                    <button class="btn-primary" onclick="showScreen('postreal')">Pay ₹24,300 →</button>
                                </div>
                            </div>

                            <!-- ============ SCREEN 9: POST REEL ============ -->
                            <div class="screen" id="screen-postreal">
                                <div class="status-bar"><div style="width: 40px"></div><div style="font-size:14px;font-weight:700;color:var(--text1)">✕</div></div>
                                <div style="padding:0 20px 12px;border-bottom:1px solid var(--gray1)">
                                    <div class="h3">Post Your Trip Reel 🎬</div>
                                    <div class="body2">Share your experience · Tag agency · Earn points</div>
                                </div>
                                <div class="scroll-area">
                                    <div style="padding:16px 20px 0">
                                        <!-- Upload area -->
                                        <div class="post-upload-area">
                                            <div class="upload-icon">🎬</div>
                                            <div class="upload-text">Tap to upload your reel</div>
                                            <div class="upload-sub">MP4 · Max 60 seconds · Min 15 seconds</div>
                                        </div>

                                        <!-- Caption -->
                                        <div class="mb-12">
                                            <div class="input-label">Caption</div>
                                            <textarea class="input" style="height:80px;resize:none;line-height:1.5" placeholder="Tell people about your experience...">Waking up to the serene peaks of Manali. The air is different up here. ⛰️ #Himachal #RoamFlow</textarea>
                                        </div>

                                        <!-- Tag agency -->
                                        <div class="mb-12">
                                            <div class="input-label">Tag Agency (required for referral)</div>
                                            <div style="display:flex;align-items:center;gap:10px;background:var(--gray1);border-radius:10px;padding:12px 14px;border:1.5px solid var(--yellow)">
                                                <div class="img-mountain" style="width:36px;height:36px;border-radius:8px;flex-shrink:0"></div>
                                                <div style="flex:1">
                                                    <div style="font-size:13px;font-weight:600;color:var(--text1)">Himalayan High Treks</div>
                                                    <div style="font-size:11px;color:var(--text3)">Booking: DEC 12–18 · Manali</div>
                                                </div>
                                                <span style="color:var(--yellow)">✓</span>
                                            </div>
                                        </div>

                                        <!-- Affiliate toggle -->
                                        <div class="affiliate-toggle">
                                            <div>
                                                <div style="font-size:13px;font-weight:600;color:var(--text1)">Set as Affiliate Reel</div>
                                                <div style="font-size:11px;color:var(--text3)">Earn referral points when people book from this reel</div>
                                            </div>
                                            <div class="toggle-switch"><div class="toggle-knob"></div></div>
                                        </div>

                                        <!-- Earn preview -->
                                        <div class="earn-preview">
                                            <div class="earn-preview-icon">💰</div>
                                            <div class="earn-preview-info">
                                                <div class="earn-title">You could earn up to ₹375 per booking</div>
                                                <div class="earn-desc">Based on 3% of ₹12,500 per referral booking</div>
                                            </div>
                                        </div>

                                        <!-- Location -->
                                        <div class="mb-12">
                                            <div class="input-label">Location</div>
                                            <input class="input" value="Manali, Himachal Pradesh">
                                        </div>

                                        <!-- Tags -->
                                        <div class="mb-20">
                                            <div class="input-label">Tags</div>
                                            <div style="display:flex;flex-wrap:wrap;gap:6px">
                                                <div class="pill active">#Himachal</div>
                                                <div class="pill active">#Manali</div>
                                                <div class="pill active">#Trekking</div>
                                                <div class="pill">#Adventure</div>
                                                <div class="pill">#Mountains</div>
                                                <div class="pill">+ Add</div>
                                            </div>
                                        </div>

                                        <!-- 1 reel note -->
                                        <div style="background:var(--gray1);border-radius:10px;padding:12px;display:flex;gap:10px;align-items:flex-start;margin-bottom:20px">
                                            <span>ℹ️</span>
                                            <div style="font-size:11px;color:var(--text3);line-height:1.5">Only 1 reel per booking can be your affiliate reel. You can post more reels freely — only this one earns referral points when others book from it.</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="sticky-bottom">
                                    <button class="btn-primary" onclick="showScreen('profile')">Post Reel & Start Earning →</button>
                                </div>
                            </div>

                            <!-- ============ SCREEN 10: PROFILE ============ -->
                            <div class="screen" id="screen-profile">
                                <div class="status-bar"><div style="width: 40px"></div><div style="display:flex;gap:10px"><span>⚙️</span></div></div>
                                <div class="scroll-area">
                                    <div class="profile-hero">
                                        <div class="profile-avatar-wrap">
                                            <div class="profile-avatar">A</div>
                                            <div class="profile-camera">📷</div>
                                        </div>
                                        <div class="profile-name">Arjun Sharma <span style="color:var(--blue);font-size:16px">✓</span></div>
                                        <div class="profile-loc">📍 New Delhi, India</div>
                                        <div class="profile-bio">Adventure seeker and mountain lover. Exploring the hidden gems of the Himalayas one trek at a time. ⛰️🎒</div>
                                        <button class="btn-outline" style="width:auto;padding:8px 24px;font-size:13px;margin-bottom:16px">✏️ Edit Profile</button>
                                    </div>

                                    <!-- Stats -->
                                    <div class="stats-row">
                                        <div class="stat-item"><div class="stat-val">24</div><div class="stat-label">Trips</div></div>
                                        <div class="stat-item"><div class="stat-val">1.2K</div><div class="stat-label">Followers</div></div>
                                        <div class="stat-item"><div class="stat-val">38</div><div class="stat-label">Bookings<br>Inspired</div></div>
                                        <div class="stat-item"><div class="stat-val">15</div><div class="stat-label">Reviews</div></div>
                                    </div>

                                    <!-- Wallet card -->
                                    <div class="wallet-card">
                                        <div class="wallet-top">
                                            <div>
                                                <div class="wallet-label">Referral Points</div>
                                                <div class="wallet-points">2,450</div>
                                                <div class="wallet-sub">≈ ₹2,450 off your next booking</div>
                                            </div>
                                            <div class="wallet-badge-wrap">
                                                <div class="wallet-badge">🥇 Gold Explorer</div>
                                                <div style="font-size:10px;color:rgba(255,255,255,.5)">38 bookings inspired</div>
                                            </div>
                                        </div>
                                        <div style="font-size:10px;color:rgba(255,255,255,.5);margin-bottom:4px">12 more bookings to Elite Explorer</div>
                                        <div class="wallet-progress"><div class="wallet-progress-fill" style="width:76%"></div></div>
                                        <div style="display:flex;justify-content:space-between;font-size:9px;color:rgba(255,255,255,.4);margin-bottom:10px;margin-top:2px"><span>Gold · 38</span><span>Elite · 50</span></div>
                                        <div class="wallet-actions">
                                            <div class="wallet-action-btn">💰 Redeem Points</div>
                                            <div class="wallet-action-btn">📊 My Earnings</div>
                                            <div class="wallet-action-btn">📤 Share</div>
                                        </div>
                                    </div>

                                    <!-- Tabs -->
                                    <div class="tab-row">
                                        <div class="tab active">Bookings</div>
                                        <div class="tab">My Reels</div>
                                        <div class="tab">Saved</div>
                                        <div class="tab">Reviews</div>
                                    </div>

                                    <!-- Upcoming -->
                                    <div class="section-header mt-12"><div class="h3">Upcoming Journeys</div><div class="view-all">VIEW ALL</div></div>
                                    <div class="journey-card-sm" onclick="showScreen('mytrips')">
                                        <div class="journey-card-sm-img img-mountain"></div>
                                        <div class="journey-card-sm-info">
                                            <div class="journey-card-sm-name">Manali Riverside Stay</div>
                                            <div class="journey-card-sm-sub">📍 Himachal Pradesh · Dec 12</div>
                                            <div class="journey-card-sm-sub">₹12,500 · 2 travelers</div>
                                        </div>
                                        <div class="journey-status status-confirmed">Confirmed</div>
                                    </div>
                                    <div class="journey-card-sm">
                                        <div class="journey-card-sm-img img-valley"></div>
                                        <div class="journey-card-sm-info">
                                            <div class="journey-card-sm-name">Rishikesh Rafting</div>
                                            <div class="journey-card-sm-sub">📍 Uttarakhand · Jan 5</div>
                                            <div class="journey-card-sm-sub">₹8,000 · 1 traveler</div>
                                        </div>
                                        <div class="journey-status status-upcoming">Upcoming</div>
                                    </div>
                                    <div style="height:20px"></div>
                                </div>
                                <div class="bottom-nav">
                                    <div class="bnav-item" onclick="showScreen('home')"><span style="font-size:22px">🏠</span><div class="bnav-label">Home</div></div>
                                    <div class="bnav-item" onclick="showScreen('reels')"><span style="font-size:22px">🎬</span><div class="bnav-label">Reels</div></div>
                                    <div class="bnav-item" onclick="showScreen('explore')"><span style="font-size:22px">🧭</span><div class="bnav-label">Explore</div></div>
                                    <div class="bnav-item active"><span style="font-size:22px">🗺️</span><div class="bnav-label" style="color:var(--yellow)">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 11: MY TRIPS ============ -->
                            <div class="screen" id="screen-mytrips">
                                <div class="status-bar"><div style="width: 40px"></div><div style="display:flex;gap:10px"><span>🔍</span><span>🔔</span></div></div>
                                <div style="padding:4px 20px 12px;display:flex;justify-content:space-between;align-items:center">
                                    <div class="h2">My Trips</div>
                                    <div class="avatar-sm">A<div class="online-dot"></div></div>
                                </div>
                                <div class="scroll-area">
                                    <div class="section-header"><div class="h3">Active Journeys</div></div>
                                    <div style="font-size:13px;color:var(--text3);padding:0 20px;margin-bottom:10px">You have 2 trips confirmed for this season.</div>
                                    <div class="active-trip-card">
                                        <div class="img-snow" style="height:100%"></div>
                                        <div style="position:absolute;top:12px;right:12px;z-index:2"><div style="background:var(--green);color:white;font-size:10px;font-weight:700;padding:4px 12px;border-radius:20px;display:flex;align-items:center;gap:4px">✓ Confirmed</div></div>
                                        <div class="active-trip-overlay">
                                            <div style="font-size:18px;font-weight:800;color:white">Manali Snow Expedition</div>
                                            <div style="font-size:12px;color:rgba(255,255,255,.8);display:flex;align-items:center;gap:4px;margin-top:3px">📍 Himachal Pradesh, India</div>
                                            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                                                <div style="font-size:11px;color:rgba(255,255,255,.7)">📅 DEC 12 – DEC 18</div>
                                                <button class="btn-sm" style="font-size:11px;padding:6px 12px" onclick="showScreen('tripdetail')">Details</button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Wishlist -->
                                    <div class="section-header"><div class="h3">❤️ My Wishlist</div><div class="view-all">View All</div></div>
                                    <div class="wishlist-item" onclick="showScreen('tripdetail')">
                                        <div class="wishlist-img img-mountain">
                                            <div class="heart-btn">❤️</div>
                                        </div>
                                        <div class="wishlist-info">
                                            <div class="wishlist-name">Solang Valley Paragliding</div>
                                            <div class="wishlist-loc">📍 Manali, India</div>
                                            <div style="display:flex;align-items:center;gap:4px"><span class="star">★</span><span class="star-val">4.9</span></div>
                                            <div class="wishlist-price">Starts at $80</div>
                                        </div>
                                        <div class="book-now-link">Book Now ›</div>
                                    </div>
                                    <div class="wishlist-item" onclick="showScreen('tripdetail')">
                                        <div class="wishlist-img img-valley">
                                            <div class="heart-btn">❤️</div>
                                        </div>
                                        <div class="wishlist-info">
                                            <div class="wishlist-name">Rishikesh Rafting Camp</div>
                                            <div class="wishlist-loc">📍 Uttarakhand, India</div>
                                            <div style="display:flex;align-items:center;gap:4px"><span class="star">★</span><span class="star-val">4.8</span></div>
                                            <div class="wishlist-price">Starts at $120</div>
                                        </div>
                                        <div class="book-now-link">Book Now ›</div>
                                    </div>
                                    <div class="wishlist-item">
                                        <div class="wishlist-img img-jungle">
                                            <div class="heart-btn">❤️</div>
                                        </div>
                                        <div class="wishlist-info">
                                            <div class="wishlist-name">Dharamshala Spiritual Retreat</div>
                                            <div class="wishlist-loc">📍 Himachal, India</div>
                                            <div style="display:flex;align-items:center;gap:4px"><span class="star">★</span><span class="star-val">4.7</span></div>
                                            <div class="wishlist-price">Starts at $210</div>
                                        </div>
                                        <div class="book-now-link">Book Now ›</div>
                                    </div>

                                    <!-- Where to next CTA -->
                                    <div style="margin:12px 20px 20px;padding:20px;background:var(--gray1);border-radius:16px;text-align:center">
                                        <div style="font-size:28px;margin-bottom:8px">🧭</div>
                                        <div class="h3 mb-4">Where to next?</div>
                                        <div class="body2 mb-16">Find inspiration from our trending reels and agencies.</div>
                                        <button class="btn-primary" onclick="showScreen('reels')">Start Discovering</button>
                                    </div>
                                </div>
                                <div class="bottom-nav">
                                    <div class="bnav-item" onclick="showScreen('home')"><span style="font-size:22px">🏠</span><div class="bnav-label">Home</div></div>
                                    <div class="bnav-item" onclick="showScreen('reels')"><span style="font-size:22px">🎬</span><div class="bnav-label">Reels</div></div>
                                    <div class="bnav-item" onclick="showScreen('explore')"><span style="font-size:22px">🧭</span><div class="bnav-label">Explore</div></div>
                                    <div class="bnav-item active"><span style="font-size:22px">🗺️</span><div class="bnav-label" style="color:var(--yellow)">Trips</div></div>
                                </div>
                            </div>

                            <!-- ============ SCREEN 12: MENU ============ -->
                            <div class="screen" id="screen-menu">
                                <div class="status-bar"><div style="width: 40px"></div><button onclick="showScreen('profile')" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text1)">✕</button></div>
                                <div style="padding:8px 20px 12px"><div class="h2">Menu</div></div>
                                <div class="scroll-area">
                                    <!-- User info -->
                                    <div class="menu-user">
                                        <div class="menu-avatar">V<div class="online-dot" style="position:absolute;bottom:2px;right:2px"></div></div>
                                        <div class="menu-user-info">
                                            <div class="menu-name">Varun Sharma</div>
                                            <div class="menu-level">Explorer Level 4</div>
                                            <div class="menu-tags">
                                                <div class="menu-tag mt-yellow">Himalaya Pro</div>
                                                <div class="menu-tag mt-green">✓ Verified</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="menu-item" onclick="showScreen('profile')">
                                        <div class="menu-item-icon">👤</div>
                                        <div class="menu-item-name">My Profile</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">👥</div>
                                        <div class="menu-item-name">Communities</div>
                                        <div class="menu-badge">3</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item" onclick="showScreen('mytrips')">
                                        <div class="menu-item-icon">📖</div>
                                        <div class="menu-item-name">My Bookings</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">🔔</div>
                                        <div class="menu-item-name">Notifications</div>
                                        <div class="menu-badge">12</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">💰</div>
                                        <div class="menu-item-name">Referral Wallet</div>
                                        <div style="font-size:12px;font-weight:700;color:var(--yellow);margin-right:4px">2,450 pts</div>
                                        <div class="menu-arrow">›</div>
                                    </div>

                                    <div class="menu-section-label">Support & Settings</div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">⚙️</div>
                                        <div class="menu-item-name">Preferences</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">🛡️</div>
                                        <div class="menu-item-name">Privacy & Security</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item">
                                        <div class="menu-item-icon">❓</div>
                                        <div class="menu-item-name">Help Center</div>
                                        <div class="menu-arrow">›</div>
                                    </div>

                                    <div class="menu-item">
                                        <div class="menu-item-icon">↗️</div>
                                        <div class="menu-item-name">Login to Another Account</div>
                                        <div class="menu-arrow">›</div>
                                    </div>
                                    <div class="menu-item logout-item" style="color:var(--red)">
                                        <div class="menu-item-icon" style="background:#FEF0F0">🚪</div>
                                        <div class="menu-item-name" style="color:var(--red)">Log Out</div>
                                        <div class="menu-arrow" style="color:var(--red)">›</div>
                                    </div>

                                    <div style="text-align:center;padding:20px;color:var(--text3);font-size:11px">
                                        <div>Globist v1.0.0</div>
                                        <div>Designed for the Wandering Soul</div>
                                    </div>
                                </div>
                            </div>

                        </div><!-- phone-inner -->
                    </div><!-- phone -->

                    <script>
                        function showScreen(id) {
                            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
                        const s = document.getElementById('screen-' + id);
                        if(s) {s.classList.add('active'); s.querySelector('.scroll-area')?.scrollTo(0,0); }
                        const map = {splash:'1',signup:'2',home:'3',reels:'4',explore:'5',region:'6',tripdetail:'7',booking:'8',postreal:'9',profile:'10',mytrips:'11',menu:'12'};
                        const idx = parseInt(map[id]||'1') - 1;
                        const btns = document.querySelectorAll('.snav-btn');
                        if(btns[idx]) btns[idx].classList.add('active');
}
                    </script>
                </body>
            </html>
