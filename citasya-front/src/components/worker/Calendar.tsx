import * as React from "react";

export function Calendar() {
  return (
    <div className="self-end px-5 py-3.5 mt-9 max-w-full bg-white rounded-2xl min-h-[462px] shadow-[0px_100px_80px_rgba(0,0,0,0.07)] w-[502px]">
      <header className="flex gap-10 justify-between items-center w-full max-md:max-w-full">
        <h3 className="self-stretch my-auto text-base font-black text-black">
          Agosto 2025
        </h3>
        <div className="flex gap-2 items-start self-stretch my-auto">
          <button className="flex gap-2.5 items-start p-4 w-[46px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/ed74dcfaa95a44a29728b63f96c1becf/ab6c168cf98ce1f4ecda8c959db0985d42a71552?placeholderIfAbsent=true"
              alt="Previous month"
              className="object-contain w-3.5 aspect-square"
            />
          </button>
          <button className="flex gap-2.5 items-start p-4 rotate-[3.141592653589793rad] w-[46px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/ed74dcfaa95a44a29728b63f96c1becf/b04e968f48003a9c9c364d828cceae707d908fe4?placeholderIfAbsent=true"
              alt="Next month"
              className="object-contain w-3.5 aspect-square"
            />
          </button>
        </div>
      </header>

      <div className="flex overflow-hidden flex-col items-center mt-3 w-full text-sm text-center text-black whitespace-nowrap max-w-[442px] max-md:max-w-full">
        <div className="flex gap-0 items-center self-stretch w-full font-semibold max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>LU</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>MA</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>MI</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>JU</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>VI</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>SA</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch p-5 my-auto w-16">
            <span>DO</span>
          </div>
        </div>

        <div className="flex gap-0 items-center self-stretch w-full max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>1</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>2</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>3</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>4</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>5</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>6</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>7</span>
          </div>
        </div>

        <div className="flex gap-0 items-center max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-white border border-gray-300 border-solid">
            <span>8</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>9</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>10</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>11</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>12</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-white border border-gray-300 border-solid">
            <span>13</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>14</span>
          </div>
        </div>

        <div className="flex gap-0 items-center max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>15</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>16</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>17</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>18</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>19</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>20</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>21</span>
          </div>
        </div>

        <div className="flex gap-0 items-center max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>22</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>23</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>24</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>25</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>26</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 border border-gray-300 border-solid">
            <span>27</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-rose-200 border border-gray-300 border-solid">
            <span>28</span>
          </div>
        </div>

        <div className="flex gap-0 items-center text-neutral-400 max-md:max-w-full">
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 text-black border border-gray-300 border-solid">
            <span>29</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 text-black bg-rose-200 border border-gray-300 border-solid">
            <span>30</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 text-black border border-gray-300 border-solid">
            <span>31</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-gray-100 border border-gray-300 border-solid">
            <span>1</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-gray-100 border border-gray-300 border-solid">
            <span>2</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-gray-100 border border-gray-300 border-solid">
            <span>3</span>
          </div>
          <div className="flex flex-col justify-center items-center self-stretch px-5 my-auto w-16 h-16 bg-gray-100 border border-gray-300 border-solid">
            <span>4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
