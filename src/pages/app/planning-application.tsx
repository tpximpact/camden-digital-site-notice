import Link from "next/link";
import Image from "next/image";
import { LocalIcon } from "../../../public/assets/icons";
import { urlFor } from "../../../util/client";
import { DataTypeArray } from "../../../util/type";

const PlanningApplications = ({ data }: (DataTypeArray)) => {
  return (
    <section className="wrap-planning-application">
      {data && data.map(({_id, image, name, development_address}: any) => {
        return (
          <Link
            key={_id}
            href={`/${_id}`}
            className="planning-application-link"
          >

            {image && (
              <Image width={330} height={223} alt="" src={urlFor(image).url()} />
            )}
            <div>
              <h3>{name}</h3>
              <span className="planning-application-text">
                <p>
                  <LocalIcon />
                  1 mile {development_address}
                </p>
              </span>
            </div>
            </Link>
        );
      })}
    </section>
  );
};

export default PlanningApplications;
