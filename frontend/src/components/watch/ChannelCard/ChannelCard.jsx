import Button from "../../common/Button/Button";

import "./ChannelCard.css";

function ChannelCard({ owner }) {

    return (

        <div className="channel-card">

            <div className="channel-left">

                <img
                    src={owner.avatar}
                    alt={owner.fullName}
                    className="channel-avatar"
                />

                <div className="channel-details">

                    <h3 className="channel-name">

                        {owner.fullName}

                    </h3>

                    <p className="channel-subscribers">

                        1.24K subscribers

                    </p>

                </div>

            </div>

            <Button>

                Subscribe

            </Button>

        </div>

    );

}

export default ChannelCard;