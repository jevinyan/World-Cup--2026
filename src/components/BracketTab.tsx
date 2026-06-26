/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BRACKET_NODES, MOCK_KNOCKOUT_MATCHES } from '../data/mockData';
import { MapPin, Trophy, ShieldAlert, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

export default function BracketTab() {
  const [activeStage, setActiveStage] = useState<'R16' | 'QF' | 'SF' | 'F'>('R16');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Filter nodes for sequential/mobile display
  const r16Nodes = BRACKET_NODES.filter((n) => n.stage === 'Round of 16');
  const qfNodes = BRACKET_NODES.filter((n) => n.stage === 'Quarterfinals');
  const sfNodes = BRACKET_NODES.filter((n) => n.stage === 'Semifinals');
  const finalNode = BRACKET_NODES.find((n) => n.stage === 'Final');

  // Find a specific match's detail
  const getMatchDetail = (nodeId: string) => {
    return MOCK_KNOCKOUT_MATCHES[nodeId] || {
      home: '待定',
      away: '待定',
      homeScore: 0,
      awayScore: 0,
      status: 'Scheduled',
    };
  };

  const renderMatchCard = (nodeId: string, label: string) => {
    const detail = getMatchDetail(nodeId);
    const isCompleted = detail.status === 'Completed';
    const isSelected = selectedNodeId === nodeId;

    return (
      <div
        onClick={() => setSelectedNodeId(nodeId)}
        className={`bg-white border-2 border-black rounded-xl p-3 shadow-[3px_3px_0px_0px_#000000] cursor-pointer hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000000] transition-all relative flex flex-col gap-2 ${
          isSelected ? 'ring-2 ring-yellow-400 bg-yellow-50/20' : ''
        }`}
      >
        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 font-mono border-b border-black/5 pb-1 uppercase">
          <span>{label}</span>
          <span className="text-[9px] bg-black text-white px-1.5 py-0.2 rounded">
            {nodeId}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 font-sans font-bold text-xs sm:text-sm text-black">
          {/* Home team */}
          <div className="flex justify-between items-center">
            <span className={isCompleted && detail.homeScore > detail.awayScore ? 'font-black text-black' : 'text-black/70'}>
              {detail.home}
            </span>
            {isCompleted && (
              <span className={`font-mono font-black ${detail.homeScore > detail.awayScore ? 'text-black bg-yellow-300 px-1 rounded border border-black text-xs' : 'text-gray-400'}`}>
                {detail.homeScore}
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex justify-between items-center">
            <span className={isCompleted && detail.awayScore > detail.homeScore ? 'font-black text-black' : 'text-black/70'}>
              {detail.away}
            </span>
            {isCompleted && (
              <span className={`font-mono font-black ${detail.awayScore > detail.homeScore ? 'text-black bg-yellow-300 px-1 rounded border border-black text-xs' : 'text-gray-400'}`}>
                {detail.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* View Indicator */}
        <div className="text-[10px] text-gray-400 text-right font-medium hover:text-black flex items-center justify-end gap-0.5">
          <span>详情 info</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title description banner */}
      <div className="bg-[#B1AFFF] border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000000] text-black">
        <h3 className="font-black text-lg sm:text-xl flex items-center gap-1.5">
          <Trophy className="w-5.5 h-5.5 text-yellow-300 fill-yellow-300 inline" />
          <span>美加墨淘汰赛晋级图 (Round of 16 至 冠军决赛)</span>
        </h3>
        <p className="text-black/80 text-xs sm:text-sm font-medium mt-1">
          由于小组赛仍在进行中，此处提供已经产生的1/8决赛对阵以及模拟预测推演路线。点击对阵卡片可查看战术分析或比赛信息！
        </p>
      </div>

      {/* Stage Selector for Mobile View */}
      <div className="flex sm:hidden gap-2 bg-gray-100 border-[3px] border-black p-1.5 rounded-xl">
        {(['R16', 'QF', 'SF', 'F'] as const).map((stage) => {
          const names = { R16: '1/8决赛', QF: '1/4决赛', SF: '半决赛', F: '总决赛' };
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`flex-1 py-2 font-bold text-xs rounded-lg border-2 border-transparent transition-all ${
                activeStage === stage
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {names[stage]}
            </button>
          );
        })}
      </div>

      {/* Graphical Desktop Connected Bracket Board */}
      <div className="hidden sm:grid grid-cols-4 gap-4 bg-[#F9F7F2] border-[3px] border-black p-6 rounded-2xl shadow-[5px_5px_0px_0px_#000000] relative overflow-x-auto min-w-[750px]">
        {/* Column 1: Round of 16 (top half) */}
        <div className="flex flex-col justify-around gap-4 z-10">
          <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono">
            1/8 决赛 (16强)
          </div>
          <div className="flex flex-col gap-5 justify-center h-full">
            {r16Nodes.slice(0, 4).map((node) => (
              <div key={node.id} className="relative">
                {renderMatchCard(node.id, node.label)}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Quarterfinals (top half) + Round of 16 (bottom half) */}
        <div className="flex flex-col justify-around gap-4 z-10">
          <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono">
            1/4 决赛 (八强)
          </div>
          <div className="flex flex-col gap-10 justify-center h-full py-6">
            {qfNodes.slice(0, 2).map((node) => (
              <div key={node.id}>
                {renderMatchCard(node.id, node.label)}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Semifinals + Quarterfinals (bottom half) */}
        <div className="flex flex-col justify-around gap-4 z-10">
          <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono">
            半决赛 (四强)
          </div>
          <div className="flex flex-col gap-20 justify-center h-full py-12">
            {sfNodes.map((node) => (
              <div key={node.id}>
                {renderMatchCard(node.id, node.label)}
              </div>
            ))}
          </div>
        </div>

        {/* Column 4: Final + Trophy */}
        <div className="flex flex-col justify-between gap-4 z-10">
          <div>
            <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono mb-4">
              冠军决赛 (FINAL)
            </div>
            {finalNode && renderMatchCard(finalNode.id, finalNode.label)}
          </div>

          <div className="bg-[#FFE227] border-[3px] border-black rounded-xl p-3.5 shadow-[3px_3px_0px_0px_#000000] text-center mt-6">
            <Trophy className="w-10 h-10 mx-auto text-black fill-[#FFE227] animate-pulse" />
            <span className="font-black text-sm block mt-2 text-black">大力神杯</span>
            <span className="text-[10px] text-black/70 font-bold">美加墨传奇由谁书写</span>
          </div>
        </div>

        {/* Bottom section: R16 bottom half + QF bottom half */}
        <div className="col-span-4 mt-6 pt-6 border-t-2 border-dashed border-black/20">
          <div className="text-xs font-black text-center bg-[#FF517A] text-white py-1 rounded border-2 border-black font-mono mb-4 inline-block px-4">
            下半区对阵 Bottom Bracket
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono">
                1/8 决赛 (下半区 4 场)
              </div>
              <div className="flex flex-col gap-3">
                {r16Nodes.slice(4, 8).map((node) => (
                  <div key={node.id}>{renderMatchCard(node.id, node.label)}</div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-xs font-black text-center bg-black text-white py-1 rounded border-2 border-black font-mono">
                1/4 决赛 (下半区 2 场)
              </div>
              <div className="flex flex-col gap-10 justify-center py-6">
                {qfNodes.slice(2, 4).map((node) => (
                  <div key={node.id}>{renderMatchCard(node.id, node.label)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphical Mobile Responsive Stack Stage View */}
      <div className="block sm:hidden flex flex-col gap-4">
        {activeStage === 'R16' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1">1/8 决赛 对阵</h4>
            {r16Nodes.map((node) => renderMatchCard(node.id, node.label))}
          </div>
        )}

        {activeStage === 'QF' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1">1/4 决赛 对阵</h4>
            {qfNodes.map((node) => renderMatchCard(node.id, node.label))}
          </div>
        )}

        {activeStage === 'SF' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1">半决赛 对阵</h4>
            {sfNodes.map((node) => renderMatchCard(node.id, node.label))}
          </div>
        )}

        {activeStage === 'F' && (
          <div className="flex flex-col gap-4">
            <h4 className="text-black font-extrabold text-sm border-b-2 border-black pb-1">总决赛</h4>
            {finalNode && renderMatchCard(finalNode.id, finalNode.label)}
          </div>
        )}
      </div>

      {/* Selected Match Node Detail Overlay/Panel */}
      {selectedNodeId ? (
        <div className="bg-white border-[3px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000000] flex flex-col gap-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE227] text-black font-mono font-black text-xs px-2 py-0.5 rounded border border-black">
                {selectedNodeId}
              </span>
              <h4 className="text-black font-black text-base sm:text-lg">淘汰赛对阵详情</h4>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-gray-400 hover:text-black font-bold font-mono text-xs border border-black/10 rounded px-1.5 py-0.5"
            >
              关闭 close
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 border-2 border-black rounded-xl p-4">
            {/* Home team */}
            <div className="text-center sm:text-right w-full sm:w-5/12 font-extrabold text-black font-sans text-sm sm:text-base">
              {getMatchDetail(selectedNodeId).home}
            </div>

            {/* Score or Status */}
            <div className="text-center w-full sm:w-2/12 flex flex-col items-center">
              {getMatchDetail(selectedNodeId).status === 'Completed' ? (
                <span className="bg-black text-white font-mono font-black text-xl px-4 py-1 rounded-xl border border-black shadow-[2px_2px_0px_rgba(255,255,255,0.1)]">
                  {getMatchDetail(selectedNodeId).homeScore} - {getMatchDetail(selectedNodeId).awayScore}
                </span>
              ) : (
                <span className="text-xs bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold font-mono">
                  SCHEDULED
                </span>
              )}
            </div>

            {/* Away team */}
            <div className="text-center sm:text-left w-full sm:w-5/12 font-extrabold text-black font-sans text-sm sm:text-base">
              {getMatchDetail(selectedNodeId).away}
            </div>
          </div>

          <div className="text-xs text-gray-500 font-sans flex flex-col gap-1.5">
            <p className="font-semibold text-black">🏟 世界杯模拟推演报告:</p>
            {getMatchDetail(selectedNodeId).status === 'Completed' ? (
              <p className="leading-relaxed">
                本场比赛为淘汰赛的关键对决。
                在激烈的90分钟拼杀中，双方奉献了顶级的战术对抗。
                最终，<span className="font-extrabold text-black">{getMatchDetail(selectedNodeId).homeScore > getMatchDetail(selectedNodeId).awayScore ? getMatchDetail(selectedNodeId).home : getMatchDetail(selectedNodeId).away}</span>
                技高一筹，攻防两端发挥更加稳健，顺利拿到晋级席位，继续在美加墨赛场上书写神话！
              </p>
            ) : (
              <p className="leading-relaxed">
                本场比赛将在小组赛全部战罢并完成小组排名重组后进行。
                作为顶尖豪强捉对撕杀的舞台，届时必然会吸引数千万人的现场围观。
                究竟是宿命对决还是黑马逆袭，让我们拭目以待！
              </p>
            )}
            <div className="flex gap-4 text-gray-400 font-bold mt-1 text-[10px]">
              <span>📍 球场: 洛杉矶 SoFi Stadium</span>
              <span>🕒 裁判组: 国际足联特派精英哨</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-black/10 rounded-2xl p-4 text-center text-gray-400 text-xs font-bold flex items-center justify-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-gray-300" />
          <span>点击上方任何淘汰赛对阵方块，可解锁详细战报分析与比分报告</span>
        </div>
      )}
    </div>
  );
}
