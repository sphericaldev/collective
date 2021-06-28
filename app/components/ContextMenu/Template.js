// @flow
import { ExpandedIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  useMenuState,
  MenuButton,
  MenuItem as BaseMenuItem,
} from "reakit/Menu";
import styled from "styled-components";
import Header from "./Header";
import MenuItem, { MenuAnchor } from "./MenuItem";
import Separator from "./Separator";
import ContextMenu from ".";
import { type MenuItem as TMenuItem } from "types";

type Props = {|
  items: TMenuItem[],
  hide?: Function,
|};

const Disclosure = styled(ExpandedIcon)`
  transform: rotate(270deg);
  position: absolute;
  right: 8px;
`;

const Submenu = React.forwardRef(({ templateItems, title, ...rest }, ref) => {
  const { t } = useTranslation();
  const menu = useMenuState({ modal: true });

  return (
    <>
      <MenuButton ref={ref} {...menu} {...rest}>
        {(props) => (
          <MenuAnchor {...props}>
            {title} <Disclosure color="currentColor" />
          </MenuAnchor>
        )}
      </MenuButton>
      <ContextMenu {...menu} aria-label={t("Submenu")}>
        <Template {...menu} items={templateItems} />
      </ContextMenu>
    </>
  );
});

function Template({ items, ...menu }: Props): React.Node {
  let filtered = items.filter((item) => item.visible !== false);

  // this block literally just trims unneccessary separators
  filtered = filtered.reduce((acc, item, index) => {
    // trim separators from start / end
    if (item.type === "separator" && index === 0) return acc;
    if (item.type === "separator" && index === filtered.length - 1) return acc;

    // trim double separators looking ahead / behind
    const prev = filtered[index - 1];
    if (prev && prev.type === "separator" && item.type === "separator")
      return acc;

    // otherwise, continue
    return [...acc, item];
  }, []);

  return filtered.map((item, index) => {
    if (item.to) {
      return (
        <MenuItem
          as={Link}
          to={item.to}
          key={index}
          disabled={item.disabled}
          selected={item.selected}
          {...menu}
        >
          {item.title}
        </MenuItem>
      );
    }

    if (item.href) {
      return (
        <MenuItem
          href={item.href}
          key={index}
          disabled={item.disabled}
          selected={item.selected}
          target="_blank"
          {...menu}
        >
          {item.title}
        </MenuItem>
      );
    }

    if (item.onClick) {
      return (
        <MenuItem
          as="button"
          onClick={item.onClick}
          disabled={item.disabled}
          selected={item.selected}
          key={index}
          {...menu}
        >
          {item.title}
        </MenuItem>
      );
    }

    if (item.items) {
      return (
        <BaseMenuItem
          key={index}
          as={Submenu}
          templateItems={item.items}
          title={item.title}
          {...menu}
        />
      );
    }

    if (item.type === "separator") {
      return <Separator key={index} />;
    }

    if (item.type === "heading") {
      return <Header key={index}>{item.title}</Header>;
    }

    return null;
  });
}

export default React.memo<Props>(Template);
