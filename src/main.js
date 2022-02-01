import './style.less'


class MusicPlayer extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.root = shadow;
        const style = document.createElement('style');
        const container = document.createElement('div');
        const thumbnail = this.getAttribute('thumbnail');
        const name = this.getAttribute('name');
        const singer = this.getAttribute('singer');
        const width = this.getAttribute('width') || '300px';
        const height = this.getAttribute('height') || '70px';
        const src = this.getAttribute('src');
        this.state = 'play';
        this.audioCtx = new AudioContext();
        this.source = this.audioCtx.createBufferSource();
        container.innerHTML = `<div class="container">
            <div class="thumbnail">
                <img src="${thumbnail}" />
                <div class="mask"></div>
                <span class="play"><svg t="1641769638280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5612" width="${height.replace('px', '')}" height="${height.replace('px', '')}"><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667zM456.704 305.92C432.704 289.152 405.333333 303.082667 405.333333 331.797333v360.533334c0 28.586667 27.541333 42.538667 51.370667 25.856l252.352-176.768c21.76-15.253333 21.632-43.541333 0-58.709334l-252.373333-176.768z m-8.597333 366.72V351.466667l229.269333 160.597333-229.269333 160.597333z" fill="#fff" p-id="5613"></path></svg></span>
                <span class="pause"><svg t="1641770012339" class="icon" viewBox="0 0 1048 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6416" width="20" height="20"><path d="M524.272128 0.018022C241.513165 0.018022 12.288102 229.245952 12.288102 512.005018c0 112.734003 36.43904 216.957952 98.17897 301.537997l38.667981-40.258048C97.458176 699.230003 67.143168 609.158963 67.143168 512.005018 67.143168 259.540992 271.807078 54.872986 524.272128 54.872986c252.45696 0 457.120973 204.668006 457.120973 457.132032 0 252.460954-204.664013 457.118003-457.120973 457.118003-96.240026 0-185.530982-29.744026-259.189043-80.53504l-34.539008 42.797978c83.150029 58.344038 184.437965 92.596019 293.728973 92.596019 282.758963 0 511.984026-229.220966 511.984026-511.976038C1036.256154 229.245952 807.031091 0.018022 524.272128 0.018022zM615.693107 256.011981l0 511.987 54.855 0L670.548107 256.012 615.693128 256.012zM377.996083 256.011981l0 511.987 54.855 0L432.851083 256.012 377.996128 256.012z" p-id="6417" fill="#fff"></path></svg></span>
            </div>
            <div class="info">
                <div class="name">${name} - ${singer}</div>
                <div style="display: flex;">
                    <div class="bar"><div class="played"><span class="flag"></span></div></div>
                    <div class="time"><span class="currentTime">00:00</span> - <span class="duration">00:00</span></div>
                </div>
            </div>
            <audio src="${src}" />
        </div>`
        style.textContent = `        
        .container{
            display: flex;
            width: ${width};
            height: ${height};
            box-shadow: 2px 2px 16px #888;
        }
        .thumbnail{
            position: relative;
        }
        img{
            width: ${height};
            height: ${height};
        }
        .mask{
            width: 100%;
            height: 100%;
            position: absolute;
            background: rgba(0,0,0,.3);
            top: 0;
            left: 0;
        }
        .play{
            width: ${height};
            height: ${height};
            position: absolute;
            left: 0;
        }
        .pause{
            width: 20px;
            height: 20px;
            position: absolute;
            right: 2px;
            bottom: 2px;
            display: none;
        }
        .info{
            margin-left: 10px;
            flex-grow:1;
            background: #fff;
        }
        .name{
            padding-top: 10px;
            padding-left: 8px;
            height: 40px;
        }
        .bar{
            margin-left: 8px;
            width: 50%;
            height: 2px;
            background: #ddd;
            flex-grow: 1;
        }
        .played{
            width: 0%;
            height: 2px;
            background: red;
        }
        .time{
            font-size: 12px;
            padding: 0 8px;
            transform: translateY(-6px);
        }
        .flag{
            display: block;
            background: #fff;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            transform: translate(0, -3px);
            border: 1px solid #eee;
            float: right;
        }
        `
        shadow.appendChild(style);
        shadow.appendChild(container);
        this.loadSource(src).then(() => {
            this.source.start(0);
        })
    }

    connectedCallback() {
        setTimeout(() => {
            const playIcon = this.root.querySelector('.play');
            const pauseIcon = this.root.querySelector('.pause');
            const audio = this.root.querySelector('audio');
            const totalTime = audio.duration;
            this.root.querySelector('.duration').innerHTML = `${String(Math.floor(audio.duration / 60)).padStart(2, '0')}:${String(Math.floor(audio.duration%60)).padStart(2, '0')}`;
            playIcon.addEventListener('click', () => {
                pauseIcon.style.display = 'inline';
                playIcon.style.display = 'none';
                this.state = 'play';
                audio.play();
            })
            pauseIcon.addEventListener('click', () => {
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'inline';
                this.state = 'pause';
                audio.pause();
            })
            const bar = this.root.querySelector('.bar');
            const played = this.root.querySelector('.played');
            const { width, x } = bar.getBoundingClientRect();
            audio.addEventListener('timeupdate', e => {
                this.root.querySelector('.currentTime').innerHTML = `${String(Math.floor(audio.currentTime / 60)).padStart(2, '0')}:${String(Math.floor(audio.currentTime%60)).padStart(2, '0')}`;
                played.style.width = `${Math.floor(audio.currentTime / totalTime * 100)}%`
            })
            audio.addEventListener('ended', () => {
                played.style.width = '0';
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'inline';
                this.root.querySelector('.currentTime').innerHTML = '00:00';
            })
            let dragStart = null; // 拖动标志位
            bar.addEventListener('mousedown', e => {
                dragStart = true;
            })
            bar.addEventListener('mouseup', e => {
                dragStart = false;
                audio.currentTime = totalTime * (played.style.width.replace('%', '') / 100);
                audio.play();
            })
            bar.addEventListener('mousemove', e => {
                if (dragStart) {
                    audio.pause();
                    const playedWidth = Math.floor((e.clientX + 4 - x) / width * 100);
                    if(playedWidth <= 100) {
                        played.style.width = `${playedWidth}%`;
                    }
                }
            })
        }, 1000)
    }

    async loadSource(src) {
        const response = await fetch(src); 
        const buffer = await response.arrayBuffer();
        return new Promise(resolve => {
            this.audioCtx.decodeAudioData(buffer, (decodedData) => {
                this.source.buffer = decodedData;
                this.source.connect(this.audioCtx.destination);
                resolve();
            });
        })
    }

}


customElements.define('music-player', MusicPlayer)



document.querySelector('#app').innerHTML = `<article class="markdown-body"><blockquote>
<p>傲不可长，欲不可从，志不可满，乐不可极。</p>
</blockquote>
<p>又到了一年一度写年终总结的时候了，老规矩，这次还是用蒙太奇手法记录我这一年的生活。这次会分成两个主题来回顾：工作(工作、学习、开源)，生活(居家、感情)。</p>
<h2 id="工作">工作</h2>
<hr>
<h4 id="晋升">晋升</h4>
<p>今年我经历了人生中的第一次晋升，还是跨级的。在今年年初时主管就有和我说过大概在下半年的时候有一次晋升机会。对于当时的我来说，进入职场不过半年。跨级晋升的压力对一个工作不足半年的职场小白来说可想而知。压力大归压力大，但我并没有退却。细细剖析了一下下个职级的要求，再看看自己还有哪些不足。当时还给自己列了一下大纲，也就是我后半年的成长计划。</p>
<p>在我成长的过程中，也给团队带来了一些改变。所以额外拿到了两次月度A级绩效，这也是公司对我这半年来工作的肯定。</p>
<p>在经过了大半年的准备之后，我顺利通过了晋升。</p>
<h4 id="团队内部技术分享">团队内部技术分享</h4>
<p>我司的晋升对技术分享是有要求的，一方面是为了达成这个要求，当然更多的是为了巩固自己的知识体系和锻炼自己的结构化表达能力。在学校时也没注意这方面的能力，工作了之后才发现表达能力是真的很重要。而且这种机会也不常有，所以我应该是我们部门中分享的最勤快的一个了。今年分享的主题涉及到<strong>基建</strong>、<strong>网络原理</strong>、<strong>编译原理</strong>和<strong>前端工程化</strong>。上面也说到我在业务架构组，平时分给我的业务需求也不是很多，就有更多的时间去做一些深层次的学习和思考。另一方面我们也承担着一部分新技术探索的任务，就要求我们对底层知识需要有所涉猎。</p>
<h4 id="学习">学习</h4>
<p>之前通过<a href="https://www.pythonhunter.org/">捕蛇者说</a>，我将我的学习过程分为了三步：<code>输入-&gt;内化-&gt;输出</code>。</p>
<p>输入部分我分为主动输入和被动输入，主动输入主要以看书和查阅相关资料为主，被动输入主要以公众号的推文和一些视频教程为主。值得一提的是我在大学时期学会的的<a href="http://musii.life/%E5%AD%A6%E4%B9%A0/%E5%AD%A6%E4%B9%A0%E7%9A%84%E6%96%B9%E6%B3%95%E8%AE%BA%E4%B8%80%EF%BC%9A%E7%9F%A5%E8%AF%86%E6%BA%AF%E6%BA%90%E6%B3%95.html">知识溯源法</a>在我职场的成长上帮了很大忙，职场大家都比较忙，能有时间学习已是不易，能高效学习就更难了。知识溯源法能让我快速知道这个技术的发展历程，当前正处于什么时期，学这门技术的ROI有多少，从而判断要不要学这门技术。</p>
<p>内化自然是以记笔记为主了。通过<a href="https://struggle-with-me.sounder.fm/">struggle with me</a>这个podcast我了解到了双链笔记的存在。也可能是极客心里在作祟，我始终认为“工欲善其事，必先利其器”。在记笔记之前，有一个好的笔记工具是非常重要的。<a href="https://struggle-with-me.sounder.fm/">struggle with me</a>也推荐了两款双链笔记，分别是<a href="https://roamresearch.com/">Roam Research</a>和<a href="https://obsidian.md/">Obsidian</a>。一方面是因为Roam的价格太过于高昂(165刀一年)，另一方面因为Obsidian采用Electron技术栈开发，同时开放了相关API供第三方开发者开发插件，我觉得这比较符合我的预期，所以最后选择了Obsidian。</p>
<p>输出部分主要是写博客和团队内部分享了。说来也惭愧，我的博客已经很久没有打理了。或许是厌倦了<a href="https://hexo.io/">Hexo</a>的那一套主题，也或许我觉得目前的写作方案不太优雅。再加上年底的时候我用来写博客的工具<a href="https://typora.io/">Typora</a>竟然收费了，这让我想着自己开发一个写作工具，这就是后话了。明年或许可以尝试下对外分享？</p>
<p>最后做一下总结吧，21年参与<a href="https://leetcode-cn.com/">leetcode</a>竞赛9场，刷题284道。很惭愧，之前定的flag是每天刷一道题，最后还是没有坚持下来。读完书籍共11本，还有3本即将读完。学习新语言<a href="https://go.dev/">Go</a>，并在团队内部搭建基建项目框架。学习常见的设计模式，在团队内部沉淀出文档。读完CSS2.1规范。貌似就没...没了？</p>
<h4 id="开源">开源</h4>
<p>今年开源依旧没有大的进展，不过在闲暇时成为了<a href="https://github.com/alibaba/lightproxy">alibaba/lightproxy</a>和<a href="https://github.com/Pana/nrm">Pana/nrm</a>的Contributors，还是蛮开心的。明年须得多花点精力在开源上了。</p>
<h2 id="生活">生活</h2>
<hr>
<p>感情方面，在今年的十月底，我结束了为期两年多的感情。长久异地、没有话题，各自忙于各自的生活，似乎没有对方也是一样。许是厌倦了这种状态，她提了分手，我在尽力挽留之后选择了不打扰。</p>
<p>以前我认为“所爱隔山海，山海皆可平”，现在我觉得“山海难平意可平”，正如工作不是生活的全部一样，爱情同样也不是。即使一个人，也要好好的生活。孤独本是人间常态，我没有你的偏爱也做不了你的例外。世界这么大，总会遇到那个“愿以余生长相守，且许一人共白头”。</p>
<p>分手之后，我开始学着生活。周末开始自己做饭，因为我是安徽人，所以我做的菜都是偏清淡一点的，一般来说一个人做个一菜一汤就够了。</p>
<p>之后又买了个烤箱，开始学烘焙。没事的时候烤个蛋挞饼干什么的。有一段时间我的早饭就是自己烤的蛋糕搭配上用挂耳和奶粉冲泡出来的拿铁，还别说味道蛮好的。</p>
<p>之后买了我人生中第一台相机——富士XT-4，本意是让我在闲暇时想着出去走走，认识一些新朋友。当然现在也在努力学着摄影的一些知识，还是蛮有趣的。</p>
<h2 id="新年新气象">新年新气象</h2>
<p>2022年，希望我</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;对于爱情：保持热爱，奔赴下一场山海。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;对于成长：戒急用忍，行稳致远。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;对于工作：精于基础，广与工具，熟于业务。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;对于生活：若只得烟花般随风飘散，请容我燃尽这半生绚烂。</p>
<p>最后，<strong>所有过往，皆为序章。余生还长，何必慌张。</strong></p>
</article><music-player name="一路生花" singer="温奕心" thumbnail="https://y.gtimg.cn/music/photo_new/T002R150x150M000001MyK3Y47zLur_2.jpg?max_age=2592000" src="./yilushenghua.m4a"></music-player>`