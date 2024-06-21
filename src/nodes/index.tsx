import type { Klass, LexicalNode } from "lexical";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { CollapsibleContainerNode } from "../plugins/collapsible-plugin/collapsible-contain-node";
import { CollapsibleContentNode } from "../plugins/collapsible-plugin/collapsible-content-node";
import { CollapsibleTitleNode } from "../plugins/collapsible-plugin/collapsible-title-node";
import { ImageNode } from "./images-node";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";

const Nodes: Array<Klass<LexicalNode>> = [
  HorizontalRuleNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  ImageNode,
  HeadingNode,
  QuoteNode,
  CodeHighlightNode,
  CodeNode,
  ListItemNode,
  ListNode,
];

export default Nodes;
